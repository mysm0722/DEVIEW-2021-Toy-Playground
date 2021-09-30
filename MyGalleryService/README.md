# MyGalleryService
Face Image &amp; Pictures Album Service

선택된 Image 저장소의 전체 사진을 읽어서 Clova CFR API를 통하여 분석 후
얼굴이 포함된 사진만 분류하여 Gallery Album을 만들어 주는 서비스입니다.


# Service Flow

(1) 이미지 저장소 분석 (파일 리스트 추출)

(2) 전체 파일 중 얼굴이 포함된 사진 및 이미지 분석 및 분리 저장(Clova CFR)

(3) 얼굴이 포함된 사진만 추출하여 갤러리 타일 이미지 
