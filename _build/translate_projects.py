import os

def translate_projects():
    file_path = "projects-vi.html"
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    replacements = {
        # Meta & Title
        "Research Lab | Chung Hy Dai": "Phân tích Dự án | Chung Hy Dai",
        "Applied research projects by Chung Hy Dai — NLP, consumer analytics, behavioral economics, and more.": "Các dự án nghiên cứu ứng dụng bởi Chung Hy Dai — NLP, phân tích người tiêu dùng, kinh tế học hành vi, và ứng dụng AI.",
        
        # Navbar
        ">Education<": ">Học vấn<",
        ">Experience<": ">Kinh nghiệm<",
        ">Research<": ">Nghiên cứu<",
        ">Credentials<": ">Chứng chỉ<",
        ">Skills<": ">Kỹ năng<",
        ">Connect on LinkedIn<": ">Kết nối trên LinkedIn<",
        
        # Hero
        "RESEARCH LAB": "PHÂN TÍCH TỔNG HỢP",
        "My Research Journey": "Hành trình Nghiên cứu",
        "Every project begins with a core question about consumer behavior, market dynamics, or strategic decisions. Review the methodologies, applied tools, and analytical outcomes for each study.": "Mỗi dự án đều bắt đầu bằng một câu hỏi cốt lõi về hành vi người tiêu dùng, động lực thị trường, hoặc chiến lược kinh doanh. Dưới đây là bức tranh toàn cảnh về phương pháp nghiên cứu, công cụ phân tích và các kết quả thu được từ từng đề tài.",
        ">Projects<": ">Dự án Tiêu biểu<",
        ">Conference Papers<": ">Bài báo Khoa học<",
        "Conference\n                            Papers": "Hội thảo\n                            Khoa học",
        ">Methods Used<": ">Phương pháp<",
        "Methods\n                            Used": "Đa dạng\n                            Phương pháp",
        
        # Cards
        "Hotel Satisfaction Drivers": "Các Yếu tố Hài lòng ngành Khách sạn",
        "Used deep learning and PRCA on 97,000+ reviews to quantify asymmetric impacts of service attributes in Vietnam.": "Ứng dụng mô hình học sâu và PRCA trên hơn 97.000 lượt đánh giá nhằm định lượng mức độ tác động bất đối xứng của các tiện ích dịch vụ lưu trú tại Việt Nam.",
        "Deep Learning · PRCA": "Học sâu Deep Learning",
        "View Research": "Xem Chi tiết Dự án",
        
        "Hotel Market Segmentation": "Phân khúc Thị trường Lưu trú",
        "Used NLP and clustering on 74,000+ guest reviews to identify distinct traveler segments in Da Nang's hotel market.": "Tận dụng NLP (Xử lý Ngôn ngữ Tự nhiên) và thuật toán phân cụm trên hơn 74.000 bình luận để lập ra các chân dung du khách tại thị trường khách sạn Đà Nẵng.",
        "NLP · Clustering": "Mô hình NLP · Phân cụm",
        
        "Motorcycle Ban & EV Transition": "Cấm Xe máy & Chuyển đổi Xe điện (EV)",
        "Motorcycle Ban &amp; EV Transition": "Cấm Xe máy &amp; Chuyển đổi Xe điện (EV)",
        "Quantified public preferences for phasing out fossil-fuel vehicles in Hanoi using a large-scale Discrete Choice Experiment.": "Sử dụng Phương pháp Lựa chọn Rời rạc quy mô lớn để lượng hóa mức độ ủng hộ của người dân đối với lộ trình loại bỏ phương tiện chạy bằng nhiên liệu hóa thạch tại Hà Nội.",
        "Choice Experiment": "Cạnh tranh Thử nghiệm",
        "WTP Analysis": "Phân tầng số WTP",
        "Mixed Logit": "Hồi quy Logit Hỗn hợp",
        
        "Virtual Influencers & Gen Z Trust": "KOL Ảo & Niềm tin Tiêu dùng GenZ",
        "Virtual Influencers &amp; Gen Z Trust": "KOL Ảo &amp; Niềm tin Tiêu dùng GenZ",
        "Studied how Generation Z builds trust with AI-generated virtual influencers and what drives their purchase decisions.": "Nghiên cứu quá trình Thế hệ Z xây dựng lòng tin với các Influencer (Người ảnh hưởng) tạo bằng AI và những yếu tố tác động đến quyết định mua hàng của họ.",
        "Quantitative Survey": "Khảo sát Định lượng Mảng rộng",
        "Statistical Modeling": "Mô hình Hóa Khảo sát Số",
        
        "Psychological Ownership": "Hành vi Sở hữu Tâm lý Cục bộ",
        "Explored how employees develop a sense of ownership at work and how that feeling shapes their commitment and motivation.": "Nghiên cứu cách nhân viên hình thành ý thức \"làm chủ tâm lý\" trong môi trường công sở, cũng như cách sự gắn hạn ấy tác động thế nào đến lòng nhiệt huyết và nỗ lực cống hiến.",
        "Survey Design": "Định lượng Khảo sát Nhanh",
        "Qualitative IDI": "Định tính Phỏng vấn Sâu IDI",
        
        "Buffet Menu Nudging": "Tâm lý học Thực đơn Buffet Khách sạn",
        "Tested whether placing healthier options first on a buffet menu can nudge people toward lower-calorie choices.": "Thực hiện phép thử để kiểm chứng xem việc ưu tiên xuất hiện các món ăn lành mạnh ở đầu thực đơn buffet có thể điều hướng người dùng chọn lựa các khẩu phần ăn ít calo hay không.",
        "Experimental Design": "Thiết lập Môi trường Giả lập",
        
        "Arts Workshop Co-creation": "Đồng sáng tạo Xưởng Nghệ thuật",
        "Looked at why people join creative workshops — and whether the social experience or the fun factor matters more.": "Đào sâu lý giải sức hút của các mô hình xưởng nghệ thuật thủ công — và đánh giá xem liệu trải nghiệm tương tác xã hội hay giá trị giải trí thuần túy mới là lực kéo chính yếu.",
        "Value Framework": "Lưới Cấu trúc Giá trị",
        
        "Motorbike Ban Policy": "Phân Tích Đề án Cấm Xe máy Sâu",
        "Measured how Hanoi residents feel about banning gasoline motorbikes — and what trade-offs they would accept.": "Đo lường mức độ đồng thuận của người dân Hà Nội với quy trình cấm xe máy chạy bằng xăng — và phân tích những điều kiện đánh đổi mà họ sẵn sàng chấp nhận.",
        "DCE Survey": "Thiết lập Gốc Bài DCE",
        "Econometrics": "Mô hình Đo Kinh tế Lượng",
        "MNL Models": "Mô hình Trọng tâm MNL",
        
        "Student Nutrition & Diet Quality": "Chất lượng Dinh dưỡng Cấp Đại học",
        "Student Nutrition &amp; Diet Quality": "Chất lượng Dinh dưỡng Cấp Đại học",
        "Surveyed 280 university students to see how their nutrition knowledge and exercise habits shape what they actually eat.": "Khảo sát 280 sinh viên hệ đại học để tìm hiểu cặn kẽ sự chênh lệch giữa lượng kiến thức dinh dưỡng họ sở hữu so với mô hình sinh hoạt thực tế được áp dụng vào bản thân.",
        "Linear Regression": "Hồi quy Đường thẳng Vô hướng",
        
        # Footer
        "Get in touch.": "Khoan vội rời đi nhé.",
        "Download the full resume or connect on LinkedIn to discuss research and data strategy.": "Chúng ta có thể đồng hành bằng cách tải phiên bản lý lịch hoàn chỉnh hoặc bấm nút kết nối qua mạng lưới LinkedIn để cùng nhau chia sẻ sâu sắc hơn về mọi dự án nghiên cứu cũng như chiến lược kinh doanh.",
        "Download Full Resume (CV)": "Tải về Bản Full PDF CV",
    }
    
    for en_text, vi_text in replacements.items():
        content = content.replace(en_text, vi_text)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Translated {file_path}")

if __name__ == '__main__':
    translate_projects()
