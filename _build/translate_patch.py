import glob
import re

def patch(file_path, replacements):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    changed = 0
    for en, vi in replacements.items():
        if en in content:
            content = content.replace(en, vi)
            changed += 1
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Patched {file_path}: {changed} replacements")

# ========== projects-vi.html ==========
projects_patch = {
    # Hero paragraph (multi-line)
    "Every project begins with a core question about consumer behavior, market dynamics, or strategic\n                        decisions. Review the methodologies, applied tools, and analytical outcomes for each study.": "Mỗi dự án đều bắt đầu bằng một câu hỏi cốt lõi về hành vi người tiêu dùng, động lực thị trường, hoặc chiến lược kinh doanh.\n                        Dưới đây là bức tranh toàn cảnh về phương pháp nghiên cứu, công cụ phân tích và các kết quả thu được từ từng đề tài.",
    # Stats
    ">Projects<": ">Dự án Tiêu biểu<",
    # Card 1: PRCA - expanded abbreviations
    "Deep\n                                    Learning · Penalty-Reward Contrast Analysis": "Học sâu\n                                    Deep Learning · Phân tích Đối lập Phạt-Thưởng (PRCA)",
    ">Hotel Satisfaction Drivers<": ">Các Yếu tố Hài lòng ngành Khách sạn<",
    "Used deep learning and PRCA on 97,000+ reviews to quantify asymmetric impacts of\n                                    service attributes in Vietnam.": "Ứng dụng mô hình học sâu và PRCA trên hơn 97.000 lượt đánh giá nhằm định lượng\n                                    mức độ tác động bất đối xứng của các tiện ích dịch vụ lưu trú tại Việt Nam.",
    ">No Language Left Behind (NLLB-200)<": ">Dịch thuật Đa ngôn ngữ (NLLB-200)<",
    ">Sentence Transformer (BERT)<": ">Véc-tơ Ngữ nghĩa (Sentence-BERT)<",
    ">Kano Model<": ">Mô hình Kano<",
    # Card 2: Hotel Segmentation - expanded abbreviations
    "Natural Language Processing · Clustering": "Xử lý Ngôn ngữ Tự nhiên (NLP) · Phân cụm",
    ">Hotel Market Segmentation<": ">Phân khúc Thị trường Lưu trú<",
    "Used NLP and clustering on 74,000+ guest reviews to identify distinct traveler\n                                    segments in Da Nang's hotel market.": "Ứng dụng NLP và thuật toán phân cụm trên hơn 74.000 bình luận\n                                    để nhận diện các tệp du khách tại thị trường khách sạn Đà Nẵng.",
    ">Natural Language Processing (RoBERTa)<": ">Xử lý Ngôn ngữ Tự nhiên (RoBERTa)<",
    ">Clustering (Gaussian Mixture Modeling)<": ">Phân cụm (Gaussian Mixture Model)<",
    # Card 3: EV
    "Motorcycle Ban & EV Transition": "Cấm Xe máy & Chuyển đổi Xe điện (EV)",
    "Quantified public preferences for phasing out fossil-fuel vehicles in Hanoi using a\n                                    large-scale Discrete Choice Experiment.": "Sử dụng Phương pháp Lựa chọn Rời rạc quy mô lớn để lượng hóa\n                                    mức độ ủng hộ của người dân đối với lộ trình loại bỏ xe xăng tại Hà Nội.",
    ">Discrete Choice Experiment<": ">Thử nghiệm Lựa chọn Rời rạc (DCE)<",
    ">Willingness to Pay Analysis<": ">Phân tích Mức sẵn lòng chi trả (WTP)<",
    ">Mixed Logit Model<": ">Mô hình Logit Hỗn hợp<",
    # Card 4: Virtual Influencers
    ">Virtual Influencers & Gen Z Trust<": ">KOL Ảo & Niềm tin Thế hệ Z<",
    "Studied how Generation Z builds trust with AI-generated virtual influencers and what\n                                    drives their purchase decisions.": "Nghiên cứu quá trình Thế hệ Z xây dựng lòng tin với các Influencer\n                                    tạo bằng AI và những yếu tố tác động đến quyết định mua hàng của họ.",
    ">Quantitative Survey<": ">Khảo sát Định lượng<",
    ">Statistical Modeling<": ">Mô hình Thống kê<",
    # Card 5: Psych Ownership
    ">Psychological Ownership<": ">Sở hữu Tâm lý Tổ chức<",
    "Explored how employees develop a sense of ownership at work and how that feeling\n                                    shapes their commitment and motivation.": "Nghiên cứu cách nhân viên hình thành cảm giác \"làm chủ\" trong công việc\n                                    và sự ảnh hưởng của tâm lý ấy đến mức cam kết và động lực làm việc.",
    ">Survey Design<": ">Thiết kế Khảo sát<",
    ">Structural Equation Modeling (SEM)<": ">Mô hình Phương trình Cấu trúc (SEM)<",
    ">Qualitative In-Depth Interviews (IDI)<": ">Phỏng vấn Chuyên sâu Định tính (IDI)<",
    # Card 6: Buffet
    ">Buffet Menu Nudging<": ">Cú Hích trên Menu Buffet<",
    "Tested whether placing healthier options first on a buffet menu can nudge people\n                                    toward lower-calorie choices.": "Thử nghiệm liệu việc ưu tiên bày các món lành mạnh lên đầu thực đơn buffet\n                                    có thể điều hướng thực khách chọn các khẩu phần ít calo hơn không.",
    ">Experimental Design<": ">Thiết kế Thực nghiệm<",
    ">ANOVA<": ">Phân tích Phương sai ANOVA<",
    # Card 7: Arts Workshop
    ">Arts Workshop Co-creation<": ">Đồng sáng tạo Xưởng Nghệ thuật<",
    "Looked at why people join creative workshops — and whether the social experience or\n                                    the fun factor matters more.": "Đào sâu lý do dẫn dắt người dùng tham gia các lớp sáng tạo — và đánh giá\n                                    liệu trải nghiệm xã hội hay niềm vui thuần túy mới là yếu tố quan trọng hơn.",
    ">Value Framework<": ">Khung Giá trị<",
    ">SEM<": ">Mô hình SEM<",
    # Card 8: Motorbike Ban
    ">Motorbike Ban Policy<": ">Phân tích Đề án Cấm Xe máy<",
    "Measured how Hanoi residents feel about banning gasoline motorbikes — and what\n                                    trade-offs they would accept.": "Đo lường mức độ đồng thuận của người dân Hà Nội với lệnh cấm xe máy xăng\n                                    — và phân tích những đánh đổi mà họ sẵn sàng chấp nhận.",
    ">Discrete Choice Experiment Survey<": ">Khảo sát Lựa chọn Rời rạc (DCE)<",
    ">Econometrics<": ">Kinh tế Lượng<",
    ">Multinomial Logit Models<": ">Mô hình Multinomial Logit<",
    # Card 9: Student Nutrition
    ">Student Nutrition & Diet Quality<": ">Chất lượng Dinh dưỡng Sinh viên<",
    "Surveyed 280 university students to see how their nutrition knowledge and exercise\n                                    habits shape what they actually eat.": "Khảo sát 280 sinh viên đại học để tìm hiểu cách kiến thức dinh dưỡng\n                                    và thói quen vận động chi phối chế độ ăn uống thực tế của họ.",
    ">Linear Regression<": ">Hồi quy Tuyến tính<",
    # General
    "View Research": "Xem Chi tiết Dự án",
    # Badges
    "CIEMB\n                                    Conference": "Hội thảo\n                                    CIEMB",
    "EEEU\n                                    Conference": "Hội thảo\n                                    EEEU",
    "Organizational\n                                    Behavior": "Hành vi\n                                    Tổ chức",
    "Behavioral\n                                    Economics": "Kinh tế học\n                                    Hành vi",
    "Experiential\n                                    Services": "Dịch vụ\n                                    Trải nghiệm",
    "FCBEM\n                                    Conference": "Hội thảo\n                                    FCBEM",
}

# ========== research-ev-vi.html ==========
ev_patch = {
    # Badge text (the actual current text)
    "DISCRETE\n                        CHOICE EXPERIMENT · WILLINGNESS TO PAY": "THỬ NGHIỆM\n                        LỰA CHỌN RỜI RẠC · MỨC SẴN LÒNG CHI TRẢ (WTP)",
    # Main title (multi-line)
    "Quantifying public preferences for a fossil-fuel vehicle phase-out in Hanoi using a Discrete\n                        Choice Experiment to identify fair and politically viable \"pull-first\" strategies.": "Đo lường sự ủng hộ đối với đề án loại bỏ xe xăng ở Hà Nội bằng phương pháp Lựa chọn\n                        Rời rạc, nhằm xác định những chính sách công bằng và khả thi về mặt thực tiễn.",
    # Econometric entry (updated text with expanded abbreviation)
    "Applied discrete choice models (conditional logit, mixed logit) to estimate\n                                    preference parameters and Willingness to Pay (WTP).": "Áp dụng các mô hình lựa chọn rời rạc (logit điều kiện, logit hỗn hợp)\n                                    để ước lượng các tham số ưu tiên và Mức sẵn lòng chi trả (WTP).",
    # Product Design Analysis (updated text)
    "Evaluated how car aesthetics (Sport Utility Vehicle: SUV vs. sedan, color) influence\n                                    consumer preference\n                                    and premium Willingness to Pay (WTP).": "Đánh giá cách thức thẩm mỹ ô tô (SUV vs. sedan, màu sắc) tác động đến sở thích\n                                    người tiêu dùng\n                                    và mức sẵn lòng chi trả thêm (WTP).",
    # Mixed Logit -> Mixed Logit Models
    "<strong>Mixed Logit (MXL) Models</strong>": "<strong>Logit Hỗn hợp (MXL)</strong>",
}

# ========== Common patches for ALL research-*-vi.html ==========
# The research-common script may have used different keys
common_patch = {
    # Back link
    "Back to All Research": "Trở về Danh mục Dự án",
    # Footer
    "Get in touch.": "Khoan vội rời đi nhé.",
    "Download the full resume or connect on LinkedIn to discuss research and data\n                strategy.": "Chúng ta có thể đồng hành bằng cách tải bản lý lịch hoàn chỉnh hoặc kết nối qua\n                LinkedIn để trao đổi về các dự án nghiên cứu và chiến lược.",
    "Download Full Resume (CV)": "Tải về Bản CV Hoàn chỉnh",
    ">Connect on LinkedIn<": ">Kết nối trên LinkedIn<",
    ">Education<": ">Học vấn<",
    ">Experience<": ">Kinh nghiệm<",
    ">Research<": ">Nghiên cứu<",
    ">Credentials<": ">Chứng chỉ<",
    ">Skills<": ">Kỹ năng<",
    # Section headers
    "Research\n                        Toolkit & Applied Skills": "Công cụ\n                        Phân tích & Kỹ năng Ứng dụng",
}

# Apply patches
patch('projects-vi.html', projects_patch)
patch('research-ev-vi.html', ev_patch)

# Apply common patches to all vi files
for f in glob.glob('*-vi.html'):
    patch(f, common_patch)

print("\nDone patching all files!")
