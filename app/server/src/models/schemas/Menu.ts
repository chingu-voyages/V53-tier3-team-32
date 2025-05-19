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
            // Ensure it's an array of 3 strings.
            // The client sends ["", "", ""] for days off.
            return Array.isArray(arr) && arr.length === 3 && arr.every(s => typeof s === 'string');
          },
          message: 'Dishes array must contain 3 meal strings.'
        },
        // Defaulting here ensures that if weeklyMenu items are somehow created without dishes,
        // they get this default. Client-side logic in SchedulesPage.tsx already provides ["", "", ""].
        default: () => ["", "", ""],
      },
      isDayOff: { type: Boolean, default: false },
    },
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

//validation to prevent overlapping dates (ensure this doesn't conflict with override logic)
MenuSchema.pre("save", async function (next) {
  if (this.isNew) { // Only run this check for new documents, not for updates from .save() on existing doc
    const existingMenu = await mongoose.model('Menu').findOne({ 
      $or: [
        {
          startDate: { $lte: this.endDate },
          endDate: { $gte: this.startDate },
        },
      ],
      createdBy: this.createdBy, 
      _id: { $ne: this._id },
    });

    if (existingMenu) {
      // This error is now primarily handled in the controller before attempting to save.
      // This pre-save hook acts as a final safety net, especially against race conditions.
      // The controller's override logic (delete then create) bypasses this for the 'new' doc being created.
      return next(new Error("Menu already exists for these dates. This is a pre-save hook check."));
    }
  }
  next();
});

export const Menu: Model<IMenu> = DB.model("Menu", MenuSchema);