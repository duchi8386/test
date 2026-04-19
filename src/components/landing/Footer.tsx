import logo from "@/assets/tika-logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/60 pt-20 pb-8">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <img src={logo} alt="TIKA Network" width={64} height={64} className="h-16 w-auto mb-6" />
            <p className="text-foreground/60 max-w-sm leading-relaxed font-light">
              Mạng lưới Influencer cao cấp kết nối các nhãn hàng với hơn 100,000+ nhà sáng tạo nội dung trên toàn Đông Nam Á.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-5 text-[10px] uppercase tracking-[0.25em] text-primary">Mạng lưới</h4>
            <ul className="space-y-3 text-foreground/60 text-sm font-light">
              <li><a href="#platform" className="hover:text-primary transition-colors">Nền tảng</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Dịch vụ</a></li>
              <li><a href="#creators" className="hover:text-primary transition-colors">KOLs</a></li>
              <li><a href="#how" className="hover:text-primary transition-colors">Quy trình</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-5 text-[10px] uppercase tracking-[0.25em] text-primary">Liên hệ</h4>
            <ul className="space-y-3 text-foreground/60 text-sm font-light">
              <li>tikamedia@gmail.com</li>
              <li>037 631 6906</li>
              <li>Quận 1, TP. Hồ Chí Minh</li>
            </ul>
          </div>
        </div>

        <div className="gold-divider mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-foreground/40 uppercase tracking-[0.15em]">
          <p>© 2025 TIKA Network. Đã đăng ký bản quyền.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Chính sách</a>
            <a href="#" className="hover:text-primary transition-colors">Điều khoản</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
