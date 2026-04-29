import { AppHeader } from "@/components/layout/AppHeader";

const PRIVACY_INTRO =
  "点呼一発で収集する個人情報は、各画面の入力項目のみです。";

const COMPANY_INFO = [
  "事業者名: 合同会社Point of View",
  "所在地: 東京都杉並区高円寺南5-9-8",
  "代表者: 代表 安藤 雅史",
  "個人情報保護管理者: 責任者",
] as const;

const COLLECTION_INTRO = "当社は、本サービスにおいて以下の情報を取得します。";

type ChipTone = "gray" | "mint";

const COLLECTION_CARDS: ReadonlyArray<{
  title: string;
  chipLabel: string;
  chipTone: ChipTone;
  content: string;
}> = [
  {
    title: "基本情報",
    chipLabel: "初回登録時",
    chipTone: "gray",
    content: "氏名、生年月日、電話番号、LINEユーザーID",
  },
  {
    title: "点呼・業務記録",
    chipLabel: "点呼・業務記録入力時",
    chipTone: "mint",
    content:
      "アルコール測定値、酒気帯びの有無、健康状態、車両番号、案件名、勤務シフト等、各画面の入力項目",
  },
];

const PURPOSES = [
  "収集した情報は、以下の目的で利用します。",
  "・本サービスの提供、運用、および保守のため。",
  "・法令に基づく運行管理業務（点呼・運転時間管理）の記録および証拠保全のため。",
  "・本サービス内でのユーザー識別およびパスワードリセット等、または高齢ドライバーの安全管理を目的とした年齢確認および管理者への通知のため。",
  "・不正アクセスの検知やシステム障害の調査のため。",
] as const;

const THIRD_PARTY = [
  "本サービスは多重下請け構造での利用を前提としています。利用者が入力した点呼記録等は、適切な運行管理・監査対応・法令遵守の目的で、利用者が所属する会社、および運送取引上関連する元請け・上位下請け企業の管理者に対して提供・共有されます。",
  "上記および法令に基づく場合を除き、事前の同意なく第三者へ提供することはありません。",
] as const;

const COMMISSION = [
  "当社は、本サービスのインフラ構築やデータ保存においてクラウドサービスを利用し、また通知機能等において外部サービス（LINEヤフー株式会社等）のAPIを利用します。これに伴い、利用目的の達成に必要な範囲内において、個人情報の取扱いの全部または一部をこれらの外部事業者に委託する場合があります。",
] as const;

const RETENTION = [
  "点呼記録および業務記録は、原則として法令に基づき1年間保存いたします。",
  "利用者の退職後においても、法令が定める保存義務期間中は当該データを保持します。",
] as const;

const CONTACT_LEAD =
  "本ポリシーに関するお問い合わせ、または個人情報の開示・訂正・削除等のご請求については、本サービス内のサポート窓口、または以下の連絡先までお問い合わせください。";

const CONTACT_EMAIL = "tenkoippatsu@gmail.com";

const FOOTER = "制定日：2026年7月1日　Ver_1.00";

const CHIP_TONE_CLASS: Record<ChipTone, string> = {
  gray: "bg-[#e8ebe6] text-[#868785] font-medium",
  mint: "bg-[#e2f6d5] text-[#163300] font-semibold",
};

const TimingChip = ({ label, tone }: { label: string; tone: ChipTone }) => (
  <span
    className={`inline-flex items-start px-2 py-[3px] rounded-full text-[11px] whitespace-nowrap ${CHIP_TONE_CLASS[tone]}`}
  >
    {label}
  </span>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[14px] font-semibold text-[#0e0f0c]">{children}</h2>
);

const BodyCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-[12px] p-4 flex flex-col">{children}</div>
);

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[14px] leading-[22px] text-[#0e0f0c]">{children}</p>
);

const renderParagraphs = (paragraphs: ReadonlyArray<string>) =>
  paragraphs.map((paragraph) => (
    <Paragraph key={paragraph}>{paragraph}</Paragraph>
  ));

export default function PrivacyPage() {
  return (
    <div className="w-full bg-[#f7f7f5] flex flex-col min-h-screen">
      <AppHeader title="プライバシーポリシー" showBack />
      <div className="w-full max-w-[765px] mx-auto flex flex-col gap-5 px-5 pt-7 pb-12">
        <section className="flex flex-col gap-2">
          <h1 className="text-[24px] font-bold text-[#0e0f0c] leading-tight">
            プライバシーポリシー
          </h1>
          <p className="text-[14px] leading-[22px] text-[#868785]">
            {PRIVACY_INTRO}
          </p>
        </section>

        <section className="flex flex-col gap-[10px]">
          <SectionHeading>1. 事業者情報</SectionHeading>
          <BodyCard>{renderParagraphs(COMPANY_INFO)}</BodyCard>
        </section>

        <section className="flex flex-col gap-[10px]">
          <SectionHeading>2. 収集する情報</SectionHeading>
          <Paragraph>{COLLECTION_INTRO}</Paragraph>
          {COLLECTION_CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-[12px] p-4 flex flex-col gap-[10px]"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-[13px] font-semibold text-[#0e0f0c]">
                  {card.title}
                </span>
                <TimingChip label={card.chipLabel} tone={card.chipTone} />
              </div>
              <div className="h-px bg-[#e8ebe6] w-full" />
              <p className="text-[13px] leading-[22px] text-[#0e0f0c]">
                {card.content}
              </p>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-[10px]">
          <SectionHeading>3. 利用目的</SectionHeading>
          <BodyCard>{renderParagraphs(PURPOSES)}</BodyCard>
        </section>

        <section className="flex flex-col gap-[10px]">
          <SectionHeading>
            4. 第三者への提供（多重下請け構造における共有）
          </SectionHeading>
          <BodyCard>
            {THIRD_PARTY.map((paragraph, index) => (
              <p
                key={paragraph}
                className={`text-[14px] leading-[22px] text-[#0e0f0c] ${
                  index > 0 ? "mt-[22px]" : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </BodyCard>
        </section>

        <section className="flex flex-col gap-[10px]">
          <SectionHeading>5. 個人情報の取扱いの委託</SectionHeading>
          <BodyCard>{renderParagraphs(COMMISSION)}</BodyCard>
        </section>

        <section className="flex flex-col gap-[10px]">
          <SectionHeading>6. 保有期間</SectionHeading>
          <BodyCard>{renderParagraphs(RETENTION)}</BodyCard>
        </section>

        <section className="flex flex-col gap-[10px]">
          <SectionHeading>7. お問い合わせ窓口</SectionHeading>
          <BodyCard>
            <Paragraph>{CONTACT_LEAD}</Paragraph>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[14px] leading-[22px] text-[#163300] underline mt-[8px] break-all"
            >
              {CONTACT_EMAIL}
            </a>
          </BodyCard>
        </section>

        <p className="text-[12px] text-[#888986] text-right">{FOOTER}</p>
      </div>
    </div>
  );
}
