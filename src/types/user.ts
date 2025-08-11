import YoungArtistCardImg from "../assets/images/YoungArtsitCard.png";
import ArtCollectorCardImg from "../assets/images/ArtCollectorCard.png";
import GalleryCardImg from "../assets/images/GalleryCard.png";

export const UserJob = {
  YOUNG_ARTIST: "Young Artist",
  ART_COLLECTOR: "Art Collector",
  GALLERY: "Gallery",
} as const;

export const UserJobDescription: Record<UserJobType, string> = {
  [UserJob.YOUNG_ARTIST]:
    "19세 이상 34세 이하로 국내외 대학교 미술대학 재학생, 휴학생, 졸업생",
  [UserJob.ART_COLLECTOR]: "개인 컬렉터 및 미술을 좋아하는 모든 사람",
  [UserJob.GALLERY]: "예술 관련 업종의 사업자 및 종사자",
} as const;

export const UserJobImages: Record<UserJobType, string> = {
  [UserJob.YOUNG_ARTIST]: YoungArtistCardImg,
  [UserJob.ART_COLLECTOR]: ArtCollectorCardImg,
  [UserJob.GALLERY]: GalleryCardImg,
} as const;

export type UserJobType = (typeof UserJob)[keyof typeof UserJob];
