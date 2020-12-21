export type RECORD = {
  id: string;
  [key: string]: any;
};

export type COLLECTION_PATH = {
  firstCollection: string;
  doc: string;
  secondCollection: string;
}[];

export type DOC_PATH = {
  firstCollection: string;
  doc: string;
}[];

// TODO: ADD ONE FOR SUBCOLLECTION
export type SUBCOLLECTION_PATH = {
  firstCollection: string;
  doc: string;
  subcollection: string;
}[];
