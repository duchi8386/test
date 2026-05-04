import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Reveal from "@/components/Reveal";

// Lấy key tại web3forms.com (miễn phí, nhập email → nhận key qua email)
const WEB3FORMS_KEY = "4e83c7f9-7e85-4345-acd8-1e50343287aa";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập họ tên")
    .max(100, "Tối đa 100 ký tự"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s().-]+$/, "Số điện thoại không hợp lệ")
    .refine((v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }, "Số điện thoại phải có 10-11 số"),
  email: z
    .string()
    .trim()
    .email("Email không hợp lệ")
    .max(255, "Tối đa 255 ký tự"),
  message: z
    .string()
    .trim()
    .min(5, "Vui lòng mô tả nhu cầu")
    .max(1000, "Tối đa 1000 ký tự"),
});

type FormErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate dữ liệu nhập bằng zod ở phía client
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((i) => {
        const key = i.path[0] as keyof FormErrors;
        if (!fieldErrors[key]) fieldErrors[key] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const { name, phone, email, message } = result.data;
      const phoneDigits = phone.replace(/\D/g, "");

      // 1) Lưu vào DB
      const { error: dbError } = await supabase.from("leads").insert({
        full_name: name,
        email,
        phone: phoneDigits,
        message,
      });
      if (dbError) console.error("Lỗi lưu lead:", dbError);

      // 2) Gửi email qua Web3Forms
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[TIKA] Yêu cầu tư vấn từ ${name}`,
          from_name: "TIKA Network",
          name,
          email,
          phone: phoneDigits,
          message,
          botcheck: false,
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Gửi thất bại");

      toast({
        title: "Đã gửi yêu cầu tư vấn",
        description:
          "Cảm ơn bạn! TIKA Network sẽ liên hệ trong thời gian sớm nhất.",
      });
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error("Lỗi gửi form:", err);
      toast({
        title: "Không gửi được yêu cầu",
        description: "Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 bg-card border-y border-border/60"
    >
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left — copy + info */}
          <div className="lg:col-span-5 space-y-8">
            <Reveal>
              <span className="inline-block text-sm md:text-base font-medium uppercase tracking-[0.3em] text-primary mb-5">
                — Đăng ký tư vấn —
              </span>
              <h2 className="font-display font-medium text-4xl md:text-5xl leading-[1.1] mb-6">
                Hãy để TIKA <span className="text-gold italic">đồng hành</span>{" "}
                cùng bạn.
              </h2>
              <div className="gold-divider w-24 mb-6" />
              <p className="text-foreground/70 font-light leading-relaxed">
                Để lại thông tin, đội ngũ chuyên gia của TIKA Network sẽ liên hệ
                tư vấn giải pháp Influencer Marketing phù hợp nhất với thương
                hiệu của bạn.
              </p>
            </Reveal>

            <ul className="space-y-4 text-sm">
              {[
                { Icon: Mail, label: "Email", value: "tikanetwork0@gmail.com" },
                { Icon: Phone, label: "Hotline", value: "037 631 6906" },
                {
                  Icon: MapPin,
                  label: "Văn phòng",
                  value: "Quận 8, TP. Hồ Chí Minh",
                },
              ].map(({ Icon, label, value }, idx) => (
                <Reveal
                  key={label}
                  delay={150 + idx * 120}
                  as="li"
                  className="flex items-start gap-3"
                >
                  <div className="w-9 h-9 border border-primary/40 flex items-center justify-center text-primary shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 mb-1">
                      {label}
                    </div>
                    <div className="text-foreground">{value}</div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <Reveal delay={200} className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="relative bg-background border border-border p-8 md:p-10 shadow-card"
              noValidate
            >
              <div
                className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary"
                aria-hidden
              />
              <div
                className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary"
                aria-hidden
              />
              <div
                className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary"
                aria-hidden
              />
              <div
                className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary"
                aria-hidden
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-[10px] uppercase tracking-[0.2em] text-foreground/70"
                  >
                    Họ và tên *
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Nguyễn Văn A"
                    maxLength={100}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-[10px] uppercase tracking-[0.2em] text-foreground/70"
                  >
                    Số điện thoại *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="0901 234 567"
                    maxLength={20}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label
                    htmlFor="email"
                    className="text-[10px] uppercase tracking-[0.2em] text-foreground/70"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="ban@congty.com"
                    maxLength={255}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label
                    htmlFor="message"
                    className="text-[10px] uppercase tracking-[0.2em] text-foreground/70"
                  >
                    Nội dung cần tư vấn *
                  </Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={handleChange("message")}
                    placeholder="Mô tả ngắn gọn về thương hiệu, mục tiêu chiến dịch, ngân sách dự kiến..."
                    rows={5}
                    maxLength={1000}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive">{errors.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-xs text-foreground/50 font-light">
                  Bằng việc gửi yêu cầu, bạn đồng ý với chính sách bảo mật của
                  TIKA Network.
                </p>
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    "Đang gửi..."
                  ) : (
                    <>
                      Gửi yêu cầu <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
