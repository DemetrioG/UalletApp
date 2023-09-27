import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import { authUser } from "../../../../../utils/query.helper";
import { ValidatedSegmentDTO } from "./types";
import { stringToPath } from "../../../../../utils/general.helper";

export async function listSegment() {
  const user = await authUser();
  if (!user) return Promise.reject();

  return await getDocs(collection(db, "segments", user.uid, "segments"));
}

export async function createSegment(formData: ValidatedSegmentDTO) {
  const user = await authUser();
  if (!user) return Promise.reject();

  return await addDoc(collection(db, "segments", user.uid, "segments"), {
    ...formData,
    value: stringToPath(formData.description),
  });
}

export async function updateSegment(formData: ValidatedSegmentDTO, id: string) {
  const user = await authUser();
  if (!user) return Promise.reject();

  const segmentRef = doc(collection(db, "segments", user.uid, "segments"), id);
  const snapshot = await getDoc(segmentRef);
  const segment = snapshot.data()?.value;

  const batch = writeBatch(db);
  const updateData = { segment: stringToPath(formData.description) };

  batch.update(segmentRef, {
    description: formData.description,
    value: stringToPath(formData.description),
  });

  const updateEntries = async (collectionName: "Real" | "Projetado") => {
    const entriesSnapshot = await getEntries(user, collectionName, segment);
    entriesSnapshot.docs.forEach((doc) => {
      const ref = doc.ref;
      batch.update(ref, { ...doc.data(), ...updateData });
    });
  };

  await Promise.all([updateEntries("Real"), updateEntries("Projetado")]);
  return await batch.commit();
}

export async function deleteSegment(id: string) {
  const user = await authUser();
  if (!user) return Promise.reject();

  const segmentRef = doc(collection(db, "segments", user.uid, "segments"), id);
  const snapshot = await getDoc(segmentRef);
  const segment = snapshot.data()?.value;

  const [projectedEntries, realEntries] = await Promise.all([
    getEntries(user, "Projetado", segment),
    getEntries(user, "Real", segment),
  ]);

  const hasEntries =
    projectedEntries.docs.length > 0 || realEntries.docs.length > 0;

  if (hasEntries)
    return Promise.reject("Há lançamentos vinculados a este segmento.");

  return await deleteDoc(segmentRef);
}

export async function checkIfSegmentExist(description: string) {
  const user = await authUser();
  if (!user) return Promise.reject();

  const segmentRef = collection(db, "segments", user.uid, "segments");
  const segmentSnapshot = await getDocs(
    query(segmentRef, where("description", "==", description))
  );

  return !(segmentSnapshot.docs.length > 0);
}

async function getEntries(
  user: any,
  modality: "Real" | "Projetado",
  segment: string
) {
  return await getDocs(
    query(
      collection(db, "entry", user.uid, modality),
      where("segment", "==", segment)
    )
  );
}
