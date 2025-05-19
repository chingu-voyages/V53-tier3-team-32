import mongoose, { Model, Schema } from "mongoose";
import { IMenu } from "../interface/IMenu";
import DB from "../../lib/DB";

const MenuSchema = new Schema<IMenu>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  weeklyMenu: [
    {
      day: { type: String, required: true },
      dishes: {
        type: [String],
        required: true,
        validate: {
          validator: function(arr: string[]) {
            return Array.isArray(arr) && arr.length === 3 && arr.every(s => typeof s === 'string');
          },
          message: 'Dishes array must contain 3 meal strings.'
        },
        default: () => ["", "", ""],
      },
      isDayOff: { type: Boolean, default: false },
    },
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

MenuSchema.pre("save", async function (next) {
  // Only run this check for new documents, not for updates from .save() on existing doc
  // or when the document is being created as part of an override where the controller handles conflict.
  if (this.isNew) {
    // Use this.constructor to refer to the Menu model, cast to Model<IMenu> for type safety
    const MenuModel = this.constructor as Model<IMenu>;
    
    const existingMenu = await MenuModel.findOne({
      $or: [
        {
          startDate: { $lte: this.endDate },
          endDate: { $gte: this.startDate },
        },
      ],
      createdBy: this.createdBy,
      // _id: { $ne: this._id } // this._id might not be set yet for a truly new doc,
                               // but if it were, this would prevent self-conflict.
                               // The main conflict check is in the controller.
    });

    if (existingMenu) {
      // This error is primarily for race conditions or direct saves bypassing controller logic.
      // The controller's createWeeklyMenu handles the user-facing override flow.
      const err = new Error("Menu already exists for these dates. This is a pre-save hook check.");
      // You might want to attach a property to the error if the client needs to distinguish this
      // (e.g., err.requiresOverride = true;), but the controller already does this.
      return next(err);
    }
  }
  next();
});

export const Menu: Model<IMenu> = DB.model<IMenu>("Menu", MenuSchema);