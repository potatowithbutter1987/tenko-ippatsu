import { AppHeader } from "@/components/layout/AppHeader";

const TERMS_INTRO =
  "本規約は、合同会社Point of View（以下「当社」）が提供する点呼一発サービスの利用条件を定めます。";

const TERMS_SECTIONS = [
  {
    heading: "1. 定義",
    paragraphs: [
      "本規約において以下の用語は次の意味で用います。",
      "・「本サービス」：点呼一発が提供する点呼業務支援サービス",
      "・「利用者」：本サービスを利用するすべてのユーザー（ドライバー・管理者）",
      "・「管理者」：所属会社の運行管理を行うために本サービスを利用する者",
      "・「ドライバー」：点呼業務を行う者として本サービスに登録された者",
    ],
  },
  {
    heading: "2. 本規約の適用",
    paragraphs: [
      "本規約は本サービスの利用開始時点で利用者と当社の間で成立します。個別規約がある場合は当該規約が優先します。",
    ],
  },
  {
    heading: "3. 規約の改定",
    paragraphs: [
      "当社は利用者の事前承諾を得ることなく本規約を改定できます。改定内容は本サービス内またはメール等で通知し、改定後の利用継続をもって同意したものとみなします。",
    ],
  },
  {
    heading: "4. アカウント登録・LINE連携",
    paragraphs: [
      "本サービスの利用には LINE アカウント連携と初回登録が必要です。利用者は登録情報を正確に保つ義務を負い、虚偽の登録があった場合、当社はアカウントを停止することがあります。",
    ],
  },
  {
    heading: "5. 利用権限・可視範囲",
    paragraphs: [
      "本サービスは多重下請け構造における運行管理を目的とします。各管理者の可視範囲は所属会社の階層と運用設定により決定され、利用者は割り当てられた範囲を超えて他者の情報にアクセスしてはなりません。",
    ],
  },
  {
    heading: "6. 利用者の義務",
    paragraphs: [
      "利用者は以下を遵守するものとします。",
      "・点呼内容を正確に入力すること",
      "・なりすまし・代理入力を行わないこと",
      "・記録の改ざん・削除を行わないこと",
    ],
  },
  {
    heading: "7. 禁止事項",
    paragraphs: [
      "利用者は次の行為を行ってはなりません。",
      "・法令または公序良俗に反する行為",
      "・本サービスの運営を妨害する行為",
      "・他者の認証情報を不正に取得・使用する行為",
      "・本サービスを通じて取得した情報を目的外に利用または第三者に開示する行為",
    ],
  },
  {
    heading: "8. サービスの提供",
    paragraphs: [
      "当社は予告なく本サービスの内容を変更、追加、停止することがあります。システム保守・障害・通信回線等の事情によりサービスが中断する場合があります。",
    ],
  },
  {
    heading: "9. データのバックアップ",
    paragraphs: [
      "当社は法令で求められる範囲で点呼記録を保管します。それ以外のデータについて利用者側でのバックアップ義務は定めません。",
    ],
  },
  {
    heading: "10. アカウントの譲渡禁止",
    paragraphs: [
      "利用者は本サービスの利用権限を第三者に譲渡・貸与・転売することはできません。",
    ],
  },
  {
    heading: "11. 利用料金",
    paragraphs: [
      "当社は、個別の利用者（ドライバー等）に対して直接の料金請求は行いません。ただし、本サービスの利用にかかる費用負担の有無およびその条件等については、利用者と運送会社との間の業務委託契約等の取り決めに従うものとし、当社は当該費用負担について一切関与せず、責任を負わないものとします。",
    ],
  },
  {
    heading: "12. 解約・退会",
    paragraphs: [
      "管理者契約の解約は当社所定の方法によります。ドライバー利用者の退職等に伴うアカウント停止は所属会社の管理者が行います。法令に基づく保存期間中はデータを保持します。",
    ],
  },
  {
    heading: "13. 免責事項",
    paragraphs: [
      "当社は本サービスの動作・点呼記録の完全性について明示・黙示を問わず保証しません。利用者間または第三者との紛争について当社は責任を負いません。",
    ],
  },
  {
    heading: "14. 個人情報の取扱い",
    paragraphs: [
      "利用者の個人情報は別途定めるプライバシーポリシーに従って取り扱います。",
    ],
  },
  {
    heading: "15. 準拠法・管轄",
    paragraphs: [
      "本規約は日本法に準拠し、本サービスに関する一切の紛争は当社所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。",
    ],
  },
] as const;

const TERMS_FOOTER = "制定日：2026年7月1日　Ver_1.00";

export default function TermsPage() {
  return (
    <div className="w-full bg-[#f7f7f5] flex flex-col min-h-screen">
      <AppHeader title="利用規約" showBack />
      <div className="w-full max-w-[765px] mx-auto flex flex-col gap-6 px-5 py-7">
        <section className="flex flex-col gap-2">
          <h1 className="text-[24px] font-bold text-[#0e0f0c] leading-tight">
            利用規約
          </h1>
          <p className="text-[14px] leading-[22px] text-[#0e0f0c]">
            {TERMS_INTRO}
          </p>
        </section>
        {TERMS_SECTIONS.map((section) => (
          <section key={section.heading} className="flex flex-col gap-[10px]">
            <h2 className="text-[14px] font-semibold text-[#0e0f0c]">
              {section.heading}
            </h2>
            <div className="bg-white rounded-[12px] p-4 flex flex-col">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[14px] leading-[22px] text-[#0e0f0c]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
        <p className="text-[12px] text-[#888986] text-right">{TERMS_FOOTER}</p>
      </div>
    </div>
  );
}
