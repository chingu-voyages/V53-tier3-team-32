import mongoose, { Model, Schema } from "mongoose";
import { IMenu } from "../interface/IMenu";
import DB from "../../lib/DB";

const MenuSchema = new Schema<IMenu>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  weeklyMenu: [
    {
      day: { type: String, required: true },
      dishes: [{ type: String, required: true }],
    },
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

//validation to prevent overlapping dates
MenuSchema.pre("save", async function (next) {
  const existingMenu = await Menu.findOne({
    $or: [
      {
        startDate: { $lte: this.endDate },
        endDate: { $gte: this.startDate },
      },
    ],
    _id: { $ne: this._id },
  });

  if (existingMenu) {
    throw new Error("Menu already exists for these dates");
  }

  next();
});

export const Menu: Model<IMenu> = DB.model("Menu", MenuSchema);
