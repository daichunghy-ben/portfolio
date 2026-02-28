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

motorbike_replacements = {
        "URBAN MOBILITY · ECONOMETRICS": "GIAO THÔNG ĐÔ THỊ · KINH TẾ LƯỢNG",
        "Motorbike Ban Policy Acceptance": "Mức độ Chấp nhận Chính sách Cấm Xe Máy",
        "Applying Discrete Choice Experiments to measure public acceptance and trade-offs regarding the proposed fossil-fuel motorbike ban in Hanoi.": "Ứng dụng Thử nghiệm Lựa chọn Rời rạc để định lượng sự đồng thuận của công chúng và những đánh đổi xoay quanh đề án hạn chế xe gắn máy chạy xăng tại Hà Nội.",
        "Multinomial Logit": "Hồi quy Multinomial Logit",
        "Hanoi relies heavily on motorbikes, leading to severe congestion and poor air quality. As authorities propose phasing out gasoline motorbikes in central districts by 2030, this research evaluates how policy design—specifically the combination of push measures (bans), pull measures (transit upgrades), and financial incentives—affects public acceptance. The study highlights significant heterogeneity in citizen preferences based on income, current transport dependency, and environmental attitudes.": "Hệ thống giao thông của Hà Nội đang phụ thuộc quá lớn vào xe máy, kéo theo hệ lụy kẹt xe và suy giảm chất lượng không khí nghiêm trọng. Trong bối cảnh thành phố định hướng loại bỏ xe máy xăng ở các quận lõi vào năm 2030, nghiên cứu này đánh giá cách thức thiết kế chính sách—đặc biệt là sự kết hợp giữa các can thiệp thắt chặt (lệnh cấm), các biện pháp hỗ trợ (nâng cấp hạ tầng), và ưu đãi tài chính—tác động thế nào đến sự ủng hộ của người dân. Kết quả cho thấy sự phân hóa rõ rệt trong sở thích của dân cư tùy thuộc vào mức thu nhập, thói quen đi lại hiện tại và góc nhìn về môi trường.",
        "Research Approach": "Cấu trúc Phương pháp",
        "Scenario Design": "Thiết lập Kịch bản Chính sách",
        "Constructed hypothetical policy packages combining restrictions, subsidies, and public transit improvements.": "Xây dựng các bộ hồ sơ chính sách giả định đan xen giữa mức độ hạn chế lưu thông, ngân sách trợ giá và sự mở rộng của phương tiện công cộng.",
        "Discrete Choice Experiment": "Thử nghiệm Lựa chọn Rời rạc",
        "Administered a stated preference survey where respondents evaluated trade-offs between different policy attributes.": "Triển khai khảo sát diện rộng dựa trên phương pháp bộc lộ sở thích (stated preference), nơi người trả lời cân nhắc sự đánh đổi giữa các điểm ưu tiên khác nhau.",
        "Econometric Modeling": "Xây dựng Mô hình Kinh tế Lượng",
        "Employed Random Utility Theory and Multinomial Logit (MNL) modeling to estimate preference heterogeneity across demographic segments.": "Sử dụng Thuyết Hữu Dụng Ngẫu Nhiên và mô hình Multinomial Logit nhằm ước lượng các mức độ khác biệt về sở thích trên các tập nhân khẩu học.",
        "Skills Applied": "Ứng dụng Kỹ năng Kỹ thuật",
        "DCE Survey Design": "Thiết kế Khảo sát DCE",
        "Stated preference elicitation for multi-attribute policy evaluation": "Trích xuất sở thích thông qua các kỹ thuật đánh giá đa biến số.",
        "Multinomial Logit Models": "Mô hình Multinomial Logit Chuyên biệt",
        "Estimating choice probabilities and parameterizing non-homogeneous preferences": "Dự báo xác suất ra quyết định và ước tính các khung thông số cho những đặc thù sở thích đa dạng.",
        "Presented at <strong>CIEMB 2025</strong>": "Diễn giả tại <strong>Hội nghị CIEMB 2025</strong>"
}

nutrition_replacements = {
        "PUBLIC HEALTH · LINEAR REGRESSION": "SỨC KHỎE CỘNG ĐỒNG · HỒI QUY TUYẾN TÍNH",
        "Student Nutrition & Diet Quality": "Chất lượng Dinh dưỡng ở Sinh viên",
        "Exploring the associations between nutrition knowledge, physical activity, and dietary intake among Vietnamese university students.": "Khám phá mối liên hệ giữa mức độ hiểu biết dinh dưỡng, thói quen vận động thể chất và thực trạng tiêu thụ thực phẩm ở sinh viên đại học Việt Nam.",
        "Diet Quality Assessment": "Đánh giá Chất lượng Bữa ăn",
        "Amidst rapid urbanisation and a dietary shift towards convenience foods in Vietnam, young adults face increasing cardiometabolic risks. This study evaluates 280 university students to determine how their foundational nutrition knowledge and weekly physical activity levels independently and jointly predict their Global Dietary Recommendations (GDR) scores, offering evidence for campus-based health promotion.": "Giữa bối cảnh đô thị hóa nhanh chóng và sự thay đổi trong hành vi ăn uống dịch chuyển về nhóm thực phẩm tiện lợi, giới trẻ Việt Nam đối mặt với những rủi ro ngày càng tăng về các bệnh chuyển hóa. Nghiên cứu tiến hành khảo sát trên 280 sinh viên đại học để xác định cách mà nền tảng kiến thức dinh dưỡng và tần suất vận động hàng tuần dự báo điểm số tuân thủ Khuyến nghị Ăn uống Toàn cầu (GDR), từ đó cung cấp căn cứ cho các chương trình cải thiện sức khỏe nội khu đại học.",
        "Research Approach": "Cấu trúc Phương pháp",
        "Validated Surveys": "Khung Khảo sát Chuẩn",
        "Deployed adapted tools including the General Nutrition Knowledge Questionnaire and International Physical Activity Questionnaire.": "Sử dụng các bộ câu hỏi được tiêu chuẩn hóa cao như Bảng hỏi Kiến thức Dinh dưỡng Tham chiếu và Bảng hỏi Hoạt động Thể chất Thường niên Quốc tế (IPQA).",
        "Pioneered the application of the Diet Quality Questionnaire (DQQ) in Vietnam to capture food group diversity and restrictions.": "Ứng dụng tiên phong Bảng tính Chất lượng Dinh dưỡng Điển hình (DQQ) tại Việt Nam nhằm đo đạc mức độ đa dạng của các nhóm thực phẩm và lượng calo tiêu thụ.",
        "Statistical Analysis": "Thống kê & Xử lý Số liệu",
        "Conducted multiple linear regression to model associations while controlling for age, sex, and BMI covariates.": "Thực hiện đa phân tích hồi quy tuyến tính để vạch rõ sơ đồ các mối quan hệ đa bên trong khi vẫn kiểm soát chặt chẽ các biến số như tuổi, giới tính và chỉ số BMI.",
        "Quantitative Survey Execution": "Vận hành Khảo sát Định lượng",
        "Deploying and structuring validated health assessments": "Ban hành và tổ chức hệ thống tham chiếu đo lường chuyên biệt cho y tế cộng đồng.",
        "Multiple Linear Regression": "Mạch Hồi quy Đa biến Tuyến tính",
        "Parametric modeling of continuous predictors upon diet scores": "Dựng mô hình thông số cho các biến liên tục tác động lên hệ chấm điểm chất lượng calo.",
        "Presented at <strong>FCBEM 2025</strong> · FPT University": "Báo cáo tại <strong>FCBEM 2025</strong> · Đại học FPT",
        "Let's build something.": "Hãy trao đổi thêm với tôi.",
        "Review my complete background or reach out to explore how I can help your team.": "Bạn có thể xem toàn bộ các thông tin quá trình hoạt động của tôi hoặc gửi tin nhắn để cùng tìm hiểu cách tôi có thể đồng hành cùng nhóm của bạn."
}

robust_translate('research-motorbike-ban-vi.html', motorbike_replacements)
robust_translate('research-nutrition-vi.html', nutrition_replacements)
