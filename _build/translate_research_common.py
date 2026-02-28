import glob

def translate_common():
    files = glob.glob('research-*-vi.html')
    
    replacements = {
        # Nav & Footer
        ">Education<": ">Học vấn<",
        ">Experience<": ">Kinh nghiệm<",
        ">Research<": ">Nghiên cứu<",
        ">Credentials<": ">Chứng chỉ<",
        ">Skills<": ">Kỹ năng<",
        ">Connect on LinkedIn<": ">Kết nối trên LinkedIn<",
        "Get in touch.": "Khoan vội rời đi nhé.",
        "Download the full resume or connect on LinkedIn to discuss research and data strategy.": "Chúng ta có thể đồng hành bằng cách tải phiên bản lý lịch hoàn chỉnh hoặc bấm nút kết nối qua mạng lưới LinkedIn để cùng chia sẻ về các dự án nghiên cứu và định hướng chiến lược.",
        "Download Full Resume (CV)": "Tải về Bản CV Hoàn chỉnh CV",
        
        # Common UI Headers
        ">Research Context<": ">Bối cảnh Nghiên cứu<",
        ">Methodology<": ">Phương pháp luận<",
        ">Key Findings<": ">Kết quả Trọng điểm<",
        ">Abstract<": ">Tóm lược Dự án<",
        ">Abstract &amp; Execution<": ">Tổng quan &amp; Triển khai<",
        ">Practical Implications<": ">Hàm ý Thực tiễn<",
        "Return to Portfolio": "Quay về Trang chủ Bài viết",
        ">OVERVIEW<": ">TỔNG QUAN VẤN ĐỀ<",
        ">METHODOLOGY<": ">PHƯƠNG PHÁP TRIỂN KHAI<",
        ">FINDINGS<": ">ĐÚC KẾT SỐ LIỆU<",
        ">IMPLICATIONS<": ">HÀM Ý THỰC TIỄN<"
    }
    
    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for en, vi in replacements.items():
            content = content.replace(en, vi)
            
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"Processed common translation for {file}")

if __name__ == '__main__':
    translate_common()
