import { Schema }from 'mongoose';
import IAllergy from "../interface/IAllergy";
import DB from "../../lib/DB";

const AllergySchema = new Schema<IAllergy>({
  name: {type: String, required: true},
  count: {type: Number , default: 0},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

export const Allergy =  DB.model("Allergy",AllergySchema);
