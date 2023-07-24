import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../../services/firebase";
import { currentUser } from "../../../../../utils/query.helper";
import { SegmentDTO, ValidatedSegmentDTO } from "./types";

export async function listSegment() {
  const user = await currentUser();
  if (!user) return Promise.reject();

  return await getDocs(collection(db, "segments", user.uid, "segments"));
}

export async function createSegment(formData: SegmentDTO) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  return await addDoc(
    collection(db, "segments", user.uid, "segments"),
    formData
  );
}

export async function updateSegment(formData: ValidatedSegmentDTO, id: string) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const segmentRef = doc(collection(db, "segments", user.uid, "segments"), id);
  return await updateDoc(segmentRef, formData as object);
}

export async function deleteSegment(id: string) {
  const user = await currentUser();
  if (!user) return Promise.reject();

  const segmentRef = doc(collection(db, "segments", user.uid, "segments"), id);
  return await deleteDoc(segmentRef);
}
