import { User } from '@/models/schemas/User';

export async function getUserAllergies(username: string) {
  try {
    const user = await User.findOne({ username }).select('allergies');
    return user?.allergies || [];
  } catch (error) {
    console.error('Error getting allergies', error);
    throw error;
  }
}

export async function addUserAllergy(username: string, allergy: string) {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("User not found");
  }

  const allergyExists = user.allergies?.includes(allergy);
  if (allergyExists) {
    throw new Error("Allergy already added");
  }

  user.allergies?.push(allergy);
  await user.save();
}
