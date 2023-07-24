export interface SegmentDTO {
  description: string | null;
}

export interface ValidatedSegmentDTO {
  description: string;
}

export interface ListSegment {
  id: string;
  description: string;
}

export interface SegmentFormParams {
  route: {
    params: ListSegment;
  };
}
