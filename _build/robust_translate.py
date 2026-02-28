import re
import os

def robust_translate(file_path, replacements):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for en, vi in replacements.items():
        # Escape regex characters but allow flexible whitespace
        en_pattern = re.escape(en)
        en_pattern = re.sub(r'\\\s+', r'\\s+', en_pattern)
        
        # Add flexibility for start and end tags if they are adjacent
        # But generally \s+ is enough for spaces and newlines
        
        # First try exact match
        if en in content:
            content = content.replace(en, vi)
        else:
            # Try regex match
            try:
                content, count = re.subn(en_pattern, vi, content)
                if count == 0:
                    print(f"Warning: Could not find '{en}' in {file_path}")
            except Exception as e:
                print(f"Error matching '{en}': {e}")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully translated {file_path}")

ev_replacements = {
        "Constructed balanced choice sets with D-optimal efficiency for realistic trade-off evaluation.": "Xây dựng các bộ lựa chọn cân bằng với độ hiệu quả D-optimal nhằm triển khai đánh giá sự đánh đổi thực tiễn.",
        "Applied discrete choice models (conditional logit, mixed logit) to estimate preference parameters and WTP.": "Áp dụng các cấu trúc lựa chọn phân tầng độc lập (logit điều kiện, logit hỗn hợp) nhằm ước lượng các đặc trưng ưu tiên và giá trị đóng góp (WTP).",
        "Evaluated how car aesthetics (SUV vs. sedan, color) influence consumer preference and premium WTP.": "Mô phỏng hóa tác động của hình thức thẩm mỹ (SUV so với sedan, màu sắc) lên thị hiếu và mức chi trả của khách hàng.",
        "Simulated market adoption scenarios to identify optimal price-feature configurations.": "Mô phỏng các kịch bản tiếp thị vào thị trường nhằm xác lập điểm thiết kế giá-tính năng tối ưu nhất.",
        "Example of the Discrete Choice Experiment profiles presented to respondents, varying attributes like design, driving range, fast-charge time, and price.": "Ví dụ về một thẻ khảo sát trong tập Thử nghiệm Lựa chọn Rời rạc được thực thi trên đáp viên, bao gồm các biến số thay đổi như thiết kế xe, phạm vi lăn bánh, tốc độ sạc nhanh và giá trị cuối mua xe.",
        "E-motorcycle Grant (15M VND)": "Trợ giá Xe điện (15 Tr VND)",
        "Financial Support": "Tài trợ Ngân sách",
        "40% More Green Space": "Tăng thêm 40% Không gian Xanh",
        "Urban Reallocation": "Quy hoạch Hạ tầng Tự nhiên",
        "100% Reinvested & Oversight": "100% Tái đầu tư & Phân bổ Công khai",
        "Revenue Allocation": "Tái cơ cấu Dòng thuế",
        "Subsidized Transit Pass": "Giảm nửa Giá Vé Công cộng",
        "30% Network Expansion": "Mở rộng 30% Lưới giao thông",
        "Public Transit": "Phương tiện Đại chúng",
        "Restrict All Motorcycles": "Lệnh Cấm Toàn bộ Xe máy",
        "Push Measure (Ban)": "Lệnh Siết chặt Xã hội (Cấm)",
        "Restrict All Vehicles (Cars+Bikes)": "Tước quyền Toàn bộ Phương tiện (Oto+Xe máy)",
        "Extreme Push Measure": "Lệnh Siết chặt Gắt gao",
        "<strong>Strategic Implication:</strong> Stand-alone \"push\" measures (bans) are heavily opposed. Packages that lead with \"pull/enabling\" investments, notably targeted e-motorcycle grants and public transit expansion, are essential to offset the immense perceived loss of mobility.": "<strong>Hàm ý Chiến lược Nhãn tiền:</strong> Các biện pháp phong bì đơn lẻ kiểu cách ly, cưỡng chế (chặn xe) dấy lên làn sóng phản ứng tột độ từ cộng đồng. Những gói giải pháp bao hàm các nguồn đầu tư mồi (pull/enabling) - điển hình nhất là trợ giá chuyển đổi xe điện và nối dài mạng lưới giao thông thiết yếu công cộng - là yếu tố tất yếu tuyệt đối để xoa dịu tổn thất tự do di chuyển cảm nhận được.",
        "Supervised by <strong>Dr. Kacy</strong> · Published at <strong>CIEMB Conference 2024</strong> · Co-authored": "Dưới sự dẫn dắt của <strong>Dr. Kacy</strong> · Vinh dự Công bố tại <strong>Diễn đàn CIEMB Hội thảo 2024</strong> · Tư cách Đồng Tác Giả"
}

robust_translate('research-ev-vi.html', ev_replacements)
