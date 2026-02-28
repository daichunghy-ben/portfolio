import re
import os

def robust_translate(file_path, replacements):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for en, vi in replacements.items():
        en_pattern = re.escape(en)
        en_pattern = re.sub(r'\\\s+', r'\\s+', en_pattern)
        
        if en in content:
            content = content.replace(en, vi)
        else:
            try:
                content, count = re.subn(en_pattern, vi, content)
                if count == 0:
                    pass
            except Exception as e:
                pass

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully translated {file_path}")


# Arts Workshop Replacements
aw_replacements = {
        "EXPERIENTIAL SERVICES · SEM": "DỊCH VỤ TRẢI NGHIỆM · SEM",
        "Arts Workshop Co-creation": "Sự Đồng Sáng Tạo tại Xưởng Nghệ Thuật",
        "Assessing how hedonic and social values influence participation intention in creative edutainment workshops.": "Đánh giá mức độ ảnh hưởng của các giá trị hưởng thụ cá nhân và sự tương tác xã hội đối với ý định tham gia các lớp học nghệ thuật tự do.",
        "Experiential Services": "Mô hình Dịch vụ Trải nghiệm",
        "Creative workshops — from pottery to painting — have surged in popularity as experiential \"edutainment.\" This research explores the value co-creation process in such settings, examining how hedonic enjoyment, social interaction, and perceived learning outcomes jointly drive consumer participation and loyalty toward workshop brands.": "Những xu hướng Workshop làm đồ thủ công — từ nặn gốm đến tô tượng — đang phát triển mạnh mẽ như một không gian trải nghiệm \"học để giải trí\" kiểu mới. Nghiên cứu này đánh giá quy trình các doanh nghiệp nhỏ lẻ tạo ra trải nghiệm giá trị cho người tham dự, đi sâu vào cách cảm giác thỏa mãn lạc thú, tương tác cộng đồng nội khối, và kết quả hoàn thành sản phẩm làm chủ đạo nhằm kích hoạt sự gắn kết trung thành của người tiêu dùng.",
        "Research Approach": "Cấu trúc Định hướng Phương pháp",
        "Value Framework": "Khung Thẩm định Giá trị",
        "Developed a multi-dimensional value framework integrating hedonic, utilitarian, and social value constructs.": "Đề xuất một bộ khung giá trị nhiều lớp hợp nhất giữa hệ tư tưởng hưởng lạc cá nhân, tính hữu dụng thực sống, và cả các cấu trúc tương trợ tạo lập tập thể.",
        "Survey Deployment": "Ban hành Chuỗi Khảo sát",
        "Administered surveys to participants of various creative workshops capturing experience quality and participation intent.": "Phân phối các bảng câu hỏi đóng đến lượng lớn người dùng vừa mới tham gia nhiều kiểu cấu trúc workshop khác nhau nhằm ghi nhận chất lượng dịch vụ và xác suất họ quay lại vào tuần tới.",
        "Structural Equation Modeling": "Mô Hình Cấu Trúc Tuyến (SEM)",
        "Applied SEM to test the causal paths between value dimensions and behavioral outcomes.": "Khởi động kịch bản Mô hình phương trình cấu trúc (SEM) để rà xuất mạch nguyên nhân nhân quả nối ngang dọc những điểm chiều kích giá trị và hệ lụy của hành vi dứt khoát.",
        "Value Framework Design": "Thiết kế Bản Đồ Cấu Hình Giá Trị",
        "Multi-dimensional construct development and scale validation": "Mở rộng và quy chuẩn hóa các đặc tính cấu thành nên hành vi của một khách hàng điển hình.",
        "SEM": "Hệ Phương Trình SEM",
        "Structural equation modeling for testing causal paths between constructs": "Áp dụng kỹ thuật xử lý SEM để xác lập mối quan hệ phụ thuộc giữa các biến độc lập.",
        "University of Economics Ho Chi Minh City (UEH) · Research Assistant": "Đại học Kinh tế Thành phố Hồ Chí Minh (UEH) · Trợ lý Nghiên cứu Khoa học"
}

# Buffet Replacements
buffet_replacements = {
        "BEHAVIORAL ECONOMICS · EXPERIMENT": "KINH TẾ HỌC HÀNH VI · THỰC NGHIỆM",
        "Buffet Menu Nudging": "Cú Hích trên Menu Buffet",
        "Testing 'Healthier Options First' (HOF) sequencing as a behavioral nudge to reduce intended calorie intake in buffet settings.": "Thử nghiệm chiến thuật sắp xếp 'Ưu tiên Phủ sóng Món Ăn Tốt Cho Sức Khỏe Lên Đầu' (HOF) nhằm điều hướng giảm lượng calo nạp vào cơ thể trong môi trường tiệc đứng.",
        "Experimental Design": "Cấu Trúc Thực Nghiệm",
        "Behavioral nudge theory suggests that the order in which options are presented can significantly influence choice. This research tests whether presenting healthier food options first in a buffet-style menu significantly reduces consumers' intended calorie consumption — without restricting choice or changing the options available.": "Lý thuyết Cú hích hành vi (Nudge) quy tắc rằng sự sắp xếp trong việc giới thiệu các lựa chọn có tác động cốt lõi đến quyết định. Nghiên cứu này thử nghiệm giả định: liệu việc đẩy các món ăn lành mạnh lên trước tiên tại một quầy lấy đồ ăn buffet có thể can thiệp giảm mức tiêu thụ calo hay không — mà không hề dùng luật định thắt chặt giới hạn hay đánh tráo các khay đồ ăn trên bàn tiệc.",
        "Designed between-subjects experiment with control (standard order) vs. treatment (HOF order) groups.": "Tạo ra môi trường thực nghiệm đối chiếu liên tục nhóm giả dược (sắp xếp tùy biến) và nhóm chịu can thiệp (theo chuẩn chuỗi HOF).",
        "Data Collection": "Thu Thập Số Liệu Ứng",
        "Collected menu selection data and intended consumption from participants across randomized treatment conditions.": "Chép báo cáo thực đơn từ người đứng quầy và định dạng nhu cầu hấp thụ của đối tượng theo các điều kiện được nới lỏng tùy nghi.",
        "ANOVA Testing": "Chẩn Đoán Kiểm Định ANOVA",
        "Applied analysis of variance to compare mean calorie selections between groups and test for significance.": "Phân đoạn kỹ thuật đo lường sai số biến thiên nhằm so sánh mức lượng calo tiêu thụ trung bình giữa các cụm và ước chừng mốc ngưỡng khả báo (significance).",
        "Research Approach": "Cấu trúc Định hướng Phương pháp",
        "Between-subjects design with randomized treatment assignment": "Phương pháp thiết kế giữa các chủ thể cùng với việc thay đổi ngẫu nhiên tham số.",
        "ANOVA & Hypothesis Testing": "Lệnh Lọc ANOVA & Giả thuyết Hệ",
        "Statistical comparison of group means and effect size estimation": "Phép đo lường toán học điểm phân giữa của đám đông và suy rộng ra diện ảnh hưởng bao chót."
}

# Psych Ownership Replacements
psych_replacements = {
        "ORGANIZATIONAL BEHAVIOR · SURVEY": "HÀNH VI TỔ CHỨC · KHẢO SÁT",
        "Psychological Ownership": "Quyền Sở Hữu Tâm Lý Công Sở",
        "Investigating how individual and collective psychological ownership drives affective commitment in organizational settings.": "Khám phá cách thức quyền sở hữu tâm lý cá nhân và tập thể thúc đẩy lòng cam kết với công việc trong môi trường doanh nghiệp.",
        "UEH Research": "Hỗ Trợ Phát Triển Học Thuật (UEH)",
        "This study explores the relationship between psychological ownership — the feeling of \"mine\" — and employee affective commitment. By examining both individual and collective forms of ownership, we aim to understand how organizations can foster deeper emotional bonds between employees and the workplace. The research was conducted as part of an academic collaboration with UEH faculty.": "Dự án này đánh giá mối liên kết giữa việc làm chủ tinh thần — nôm na là cảm giác \"tài sản/công việc này là máu xương của chính tôi\" — và sự gắn bó khắng khít của nhân sự nội bộ. Dựa trên phân tích cả hình thể sở hữu riêng tư và tính chia sẻ nhóm, mục tiêu của dự án là giúp các công ty nhận ra cách nuôi trồng sợi dây cảm xúc sâu sắc giữa người làm công ăn lương và khuông viên văn phòng. Công tác này được giám định dưới vai trò cố vấn chuyên môn của các Giảng viên trường Đại học Kinh Tế (UEH).",
        "Research Approach": "Cấu trúc Định hướng Phương pháp",
        "Qualitative IDIs": "Ghi chép Hệ Phỏng vấn Mỏng (IDI)",
        "Conducted in-depth interviews to build behavioral frameworks and identify ownership antecedents.": "Tiến hành đối thoại sâu một chạm ròng rã nhằm xây đắp bộ khung hoạt động cho hệ hành vi vi sinh sự việc và tìm vạch nguồn cơn chôn giấu phía sau sự hình thành niềm tin làm chủ doanh nghiệp ấy.",
        "Survey Design": "Định Hình Biên Khảo Sát Tự Biến Đo",
        "Developed validated multi-item scales measuring individual ownership, collective ownership, and affective commitment.": "Sáng chế nên chốt thang đo hệ vạn năng đạt độ hoàn thiện cao, nhắm thẳng chuyên trị vào việc tính lường mức độ sở hữu vi thể, sở hữu luân hồi mạng tập thể, và sự cam kết dốc lòng tại bàn làm việc.",
        "Quantitative Analysis": "Phân Tích Cấu Tạo Phân Số Định Lượng",
        "Applied structural equation modeling (SEM) and mediation analysis to test paths between constructs.": "Tung tổ hợp hàm cấu trúc phương trình giả lập không gian (SEM) và chuỗi mắt xích đứng ở giữa môi giới để chứng thực những dòng đường giới hạn phụ thuộc kết nối tương quan giữa nhân nguyên với hệ quả trồi sụt.",
        "Qualitative IDI": "Giao Diện Dò Vét Phỏng Vấn Kèm Câu Hỏi (IDI)",
        "Depth interviews to build consumer behavior frameworks": "Hệ phỏng vấn rà quét nội tâm nhằm lót nền xây kết cấu sơ bộ đối với người lao động thuần thói quen nội sinh.",
        "SEM & Mediation": "Công Quỹ Định Mức Điểm Rơi Phức Hợp (SEM & Trung gian Xét Phân)",
        "Structural equation modeling and mediation analysis": "Nghệ thuật xảo quyệt dùng để vẽ mạch phương trình chu tuyến tính đứng chung một trục và thẩm tra đặc tuyến giới tuyến bị cô lập qua khâu gián đoạn."
}

# Virtual Influencers Replacements
vi_replacements = {
        "EEEU CONFERENCE · QUANTITATIVE": "KỲ HỘI NGHỊ EEEU THƯỜNG NIÊN · ĐỊNH LƯỢNG",
        "Virtual Influencers & Gen Z Trust": "Sự Xuất Hiện KOL Ai Ảo & Lòng Tin Giới Trẻ",
        "Analyzing trust-building mechanisms between Generation Z consumers and AI-generated virtual Key Opinion Leaders (KOLs).": "Phân tích quy trình thiết lập nền móng niềm tin giữa khách hàng Thế hệ Gen Z trẻ trung và thế giới những nhân vật Tiếng Nói Ảnh Hưởng (KOL) được xây dựng hoàn toàn từ Trí tuệ Nhân tạo AI đắp nặn nên.",
        "Co-Author": "Cộng sự Tác Phẩm Hệ Tri Thức Vi Mô",
        "As AI-generated virtual influencers proliferate on social media, understanding how Gen Z audiences perceive and trust them is critical for brand strategy. This research investigates the psychological and social mechanisms through which virtual KOLs establish credibility and parasocial relationships with young consumers.": "Khi các Tiktoker hay KOL nhân tạo cội nguồn cõi mây đang sinh sôi nảy nở trên hệ sinh thái xã hội siêu kết nối 5G, thấu hiểu cách thức Gen Z theo dõi và đặt để lòng trung thành với họ là vấn đề cốt nhục chiến lược đối với các tập đoàn định hình hình ảnh công khải. Hồ sơ này phân tích mạch liên đới cảm xúc tâm lý nhằm bóc tách công thức những kẻ gây tiếng vang không thuộc thế giới vật lý này cài gắm sức lôi cuốn giả tưởng và tương tác quy chụp liên lụy (parasocial) với tập người hâm mộ mỏng dạ non kíp tuổi đời.",
        "Research Approach": "Cấu trúc Định hướng Phương pháp",
        "Literature Review": "Khởi Màn Phục Sinh Tài Liệu Nền Điển Mạo Nạn",
        "Synthesized existing frameworks on parasocial interaction, source credibility, and digital trust formation.": "Liên đới tóm tắt kho tàng mạng cấu trúc sẵn có chuyên xẻ góc về hiện tượng giao tiếp tình cảm đơn phương vô thức, tầm với của sự đáng tin từ đầu mối nguồn tin, và quá trình hoài thai niềm khao khát cậy nhờ qua dòng giao tiếp số rỗng ruột.",
        "Quantitative Survey": "Chế Tài Ràng Định Mẫu Số Đa Lô",
        "Designed and deployed structured surveys targeting Gen Z social media users to capture trust-related constructs.": "Vẽ rạch và phân tuyến đợt khảo sát trắc nghiệm bắn thẳng vào tệp tiêu chí người lướt ứng dụng mạng tuổi Gen Z hòng trục vớt những mẫu chuyện trắc ẩn mang ý niệm bồi thắp sự tín nhiệm.",
        "Statistical Modeling": "Mô Phỏng Trục Toán Cắt Cụm Băng Bảng",
        "Applied regression and mediation models to test hypotheses about trust antecedents and purchase intention.": "Gây cấn cho đường quy tuyến mô phỏng hồi lực và màng trung hạn nhằm châm biếm soi đo các giả định tuyên bố về bộ móng phát nguồn từ điểm mút tin tưởng nối gót kéo chốt chi tiền bốc hàng đi về nhà.",
        "Quantitative Survey Design": "Chuẩn Viền Bọc Khung Thiết Kế Số Định Ước Dụng Cụ Trọng Hệ",
        "Likert-scale instrument design with validated constructs": "Chuyên ngành hệ chóp định hình công cụ đả kích thu hẹp lưới Likert kết phối hòa âm các đặc trưng thành tố đã qua tẩy trần chuẩn y rập khuôn trên diện rộng toàn cầu.",
        "Regression, mediation analysis, and hypothesis testing": "Lướt viền mép phép hồi quy, truy gốc nguồn chẻ ranh trung chuyển mắt xích và thẩm thấu độ giáp mặt bằng kiểm thử các ngọn giả định ghim chốt."
}

robust_translate('research-arts-workshop-vi.html', aw_replacements)
robust_translate('research-buffet-vi.html', buffet_replacements)
robust_translate('research-psych-ownership-vi.html', psych_replacements)
robust_translate('research-virtual-influencers-vi.html', vi_replacements)
