import DiagnosticsClient from "./diagnostics-client";

export const metadata = {
  title: "Fadeo diagnostics",
  robots: { index: false, follow: false },
};

export default function FadeoDiagnosticsPage() {
  return <DiagnosticsClient />;
}
