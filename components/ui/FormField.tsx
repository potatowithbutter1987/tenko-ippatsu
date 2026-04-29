type Props = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

export const FormField = ({ label, required, error, children }: Props) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-[14px] font-semibold text-[#0e0f0c] leading-none">
        {label}
        {required ? <span className="text-[#e23b4a] ml-0.5">*</span> : null}
      </span>
      {children}
      {error ? <p className="text-[12px] text-[#e23b4a]">{error}</p> : null}
    </div>
  );
};
