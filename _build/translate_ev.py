import os

def translate_ev():
    file_path = "research-ev-vi.html"
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = {
        "Public Preferences for a Fossil-Fuel Vehicle Phase-Out in a Motorcycle-Dependent City: A Discrete Choice Experiment in Hanoi.": "Đo lường Mức độ Đồng thuận của Công chúng về Lộ trình Loại bỏ Xe Cũ tại Thành phố Phụ thuộc Xe cá nhân: Tại Hà Nội.",
        "Back to All Research": "Trở về Danh mục Dự án",
        "DISCRETE CHOICE EXPERIMENT · WTP": "THỬ NGHIỆM LỰA CHỌN RỜI RẠC · WTP",
        "Quantifying public preferences for a fossil-fuel vehicle phase-out in Hanoi using a Discrete Choice Experiment to identify fair and politically viable \"pull-first\" strategies.": "Đo lường sự ủng hộ đối với đề án loại bỏ xe máy xăng ở Hà Nội bằng phương pháp Lựa chọn Rời rạc, nhằm xác định những chính sách công bằng và khả thi về mặt thực tiễn.",
        "Large Scale Choice Experiment": "Thử nghiệm Lựa chọn Quy mô Rộng",
        "The Policy Dilemma": "Vấn đề Chính sách",
        "Motorcycle-dependent cities face a critical conflict: how to address severe air pollution without undermining the socioeconomic fabric that relies on two-wheeled mobility. Hanoi exemplifies this with its plan to phase out fossil-fuel motorcycles by 2030.": "Các đô thị với tỷ lệ xe máy dày đặc luôn phải đối mặt với một xung đột cốt yếu: làm sao để cải thiện chất lượng không khí nhưng không làm suy thoái nền kinh tế bám rễ vào loại hình di chuyển này. Đề án loại trừ xe máy xăng của Hà Nội vào năm 2030 là một ví dụ rõ rệt.",
        "This study employed a <strong>Discrete Choice Experiment (DCE)</strong> backed by <strong>Mixed Logit (MXL)</strong> models to quantify preferences for various phase-out policy packages. We analyzed trade-offs between restrictive \"Push\" measures, compensating \"Pull\" measures (public transit, greenery), and critical financial \"Support\" mechanisms.": "Nghiên cứu ứng dụng <strong>Thử nghiệm Lựa chọn Rời rạc (DCE)</strong> kết hợp <strong>Logit Hỗn hợp (MXL)</strong> để định lượng sự ưa chuộng đối với những phương án thiết kế đề án cấm xe khác nhau. Dự án phân tích những sự đánh đổi giữa các biện pháp siết chặt (Push measures), các chính sách đền bù (Pull measures), và các khoản hỗ trợ tài chính từ công quỹ nhà nước.",
        "Research Toolkit & Applied Skills": "Công cụ Phân tích Cốt lõi",
        "Experimental Design": "Thiết kế Bài Khảo sát",
        "Constructed balanced choice sets with D-optimal efficiency for realistic trade-off evaluation.": "Xây dựng các bộ lựa chọn cân bằng trên hệ mô phỏng D-Optimal nhằm tiến hành một cuộc đánh giá thực thi đánh đổi sát sao.",
        "Econometric Modeling": "Mô hình Kinh tế Lượng",
        "Applied discrete choice models (conditional logit, mixed logit) to estimate preference parameters and WTP.": "Áp dụng các mô hình hệ thống đo lường ngẫu nhiên để ước lượng các đặc trưng tiên quyết và Mức sẵn lòng chi trả.",
        "Product Design Analysis": "Thẩm định Chức năng",
        "Evaluated how car aesthetics (SUV vs. sedan, color) influence consumer preference and premium WTP.": "Dự kiến cách khía cạnh vật lý và thẩm mỹ tác động đến mức độ chi trả thêm của tiêu dùng nội địa Hàn Quốc.",
        "Market Simulation": "Mô phỏng Thị trường Bán lẻ",
        "Simulated market adoption scenarios to identify optimal price-feature configurations.": "Mô phỏng kịch bản tiếp thị để chắt lọc khối tính năng cân bằng với giá cả xuất xưởng.",
        "Data Visualization": "Số hóa Đồ thị",
        "Example of the Discrete Choice Experiment profiles presented to respondents, varying attributes like design, driving range, fast-charge time, and price.": "Ví dụ về những hồ sơ trắc nghiệm được trình diện cho đáp viên trước khi họ thực hiện bước trả lời.",
        "Waiting for EV Choice Experiment Image": "Đang chờ Hình ảnh Thực nghiệm EV",
        "Please save the car image from our chat as ev-choice-experiment.png inside the assets/ folder.": "Vui lòng lưu hình ảnh liên quan vào thư mục tương đối.",
        "E-motorcycle Grant (15M VND)": "Trợ giá mua Xe Máy điện",
        "Financial Support": "Ngân sách Hỗ trợ",
        "40% More Green Space": "Nới rộng Không gian Xanh",
        "Urban Reallocation": "Tái Quy hoạch Đô thị",
        "100% Reinvested & Oversight": "Tái đầu tư Hệ thống & Minh bạch",
        "Revenue Allocation": "Phân bổ Cục diện Quỹ",
        "Subsidized Transit Pass": "Giảm Giá vé Vận tải BRT",
        "30% Network Expansion": "Mở Rộng Đường Nội thành",
        "Public Transit": "Phương tiện Giao thông Mạng",
        "(Cost)": "(Phụ chi Cố định)",
        "Restrict All Motorcycles": "Ra lệnh Thu hồi Xe gắn máy",
        "Push Measure (Ban)": "Biện pháp Siết chặt Quy định",
        "Restrict All Vehicles (Cars+Bikes)": "Thu hồi Toàn bộ Vận tải Tư nhân",
        "Extreme Push Measure": "Siết chặt Tuyệt đối",
        "<strong>Strategic Implication:</strong> Stand-alone \"push\" measures (bans) are heavily opposed. Packages that lead with \"pull/enabling\" investments, notably targeted e-motorcycle grants and public transit expansion, are essential to offset the immense perceived loss of mobility.": "<strong>Hàm ý Chiến lược Khuyến nghị:</strong> Các điều luật cấm đoán đơn lẻ phải đi kèm cùng những gói hỗ trợ bù đắp hệ thống, điển hình nhất là khoản tiền đền bù thu mua để hỗ trợ dân sinh chuyển đổi qua hệ xe máy điện năng và cải cách diện rộng mạng lưới xe buýt BRT.",
        "Supervised by <strong>Dr. Kacy</strong> · Published at <strong>CIEMB Conference 2024</strong> · Co-authored": "Được cố vấn bởi <strong>Dr. Kacy Hồ</strong> · Ra mắt tại Kỷ yếu <strong>CIEMB 2024</strong> · Đồng Trợ lý tác giả"
    }

    for en, vi in replacements.items():
        if en in content:
            content = content.replace(en, vi)
        else:
            print(f"Warning: Could not find '{en}' in file")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Translated {file_path}")

if __name__ == '__main__':
    translate_ev()
