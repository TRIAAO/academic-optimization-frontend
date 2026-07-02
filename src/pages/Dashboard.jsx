import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LibraryBig,
  Link2,
  Network,
  RefreshCw,
  ShieldCheck,
  UserRoundSearch
} from "lucide-react";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import PageHeader from "../components/ui/PageHeader";
import PrimaryButton from "../components/ui/PrimaryButton";
import StatCard from "../components/ui/StatCard";
import { APP_CONFIG } from "../config/app";
import { dashboardService } from "../services/dashboardService";
import { formatDateTime, formatNumber } from "../utils/formatters";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const data = await dashboardService.getInstitutionalDashboard();
      setDashboard(data);
    } catch (apiError) {
      setError(
        apiError?.message ||
          "Não foi possível carregar o dashboard institucional."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <LoadingState message="Carregando visão institucional da plataforma..." />
    );
  }

  const stats = [
    {
      title: "Pesquisadores",
      value: formatNumber(dashboard?.totalResearchers),
      description: "Professores e pesquisadores cadastrados.",
      icon: UserRoundSearch
    },
    {
      title: "Perfis Acadêmicos",
      value: formatNumber(dashboard?.totalAcademicProfiles),
      description: "Perfis acadêmicos organizados na plataforma.",
      icon: GraduationCap
    },
    {
      title: "Pesquisadores com ORCID",
      value: formatNumber(dashboard?.researchersWithOrcid),
      description: "Pesquisadores com identificador ORCID informado.",
      icon: Link2
    },
    {
      title: "Obras ORCID",
      value: formatNumber(dashboard?.totalOrcidWorks),
      description: "Obras acadêmicas importadas ou vinculadas via ORCID.",
      icon: BookOpenCheck
    },
    {
      title: "Obras OpenAlex",
      value: formatNumber(dashboard?.totalOpenAlexWorks),
      description: "Obras encontradas ou importadas do OpenAlex.",
      icon: Network
    },
    {
      title: "Obras Revisadas",
      value: formatNumber(dashboard?.reviewedWorks),
      description: "Obras confirmadas ou rejeitadas pela revisão manual.",
      icon: ClipboardCheck
    },
    {
      title: "DOIs Validados",
      value: formatNumber(dashboard?.validatedDois),
      description: "Validações bibliográficas realizadas via Crossref.",
      icon: LibraryBig
    },
    {
      title: "Relatórios",
      value: formatNumber(dashboard?.optimizationReports || 0),
      description: "Relatórios de otimização acadêmica gerados.",
      icon: FileText
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Visão institucional"
        title="Dashboard Institucional IMETRO"
        description="Acompanhe a evolução dos pesquisadores, perfis acadêmicos, integrações científicas, revisão de obras, validações DOI e relatórios de otimização acadêmica."
        actions={
          <PrimaryButton variant="light" icon={RefreshCw} onClick={loadDashboard}>
            Atualizar dashboard
          </PrimaryButton>
        }
      >
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-blue-700" />

            <div>
              <h3 className="font-black text-blue-950">
                Plataforma acadêmica institucional
              </h3>

              <p className="mt-2 text-sm leading-7 text-blue-900">
                Este painel apresenta apenas informações institucionais úteis
                para acompanhamento acadêmico. Informações técnicas da
                infraestrutura, API, banco de dados, segurança e endpoints ficam
                restritas à área técnica da TRIA Company.
              </p>
            </div>
          </div>
        </div>
      </PageHeader>

      {error && (
        <ErrorState title="Erro no dashboard institucional" message={error} />
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-black text-slate-950">Revisão Manual</h3>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            A revisão manual ajuda a evitar associação incorreta de obras
            acadêmicas aos pesquisadores.
          </p>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-4">
              <span className="text-sm font-semibold text-amber-900">
                Pendentes
              </span>
              <span className="text-xl font-black text-amber-700">
                {formatNumber(dashboard?.pendingReviewWorks)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4">
              <span className="text-sm font-semibold text-emerald-900">
                Confirmadas
              </span>
              <span className="text-xl font-black text-emerald-700">
                {formatNumber(dashboard?.confirmedWorks)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-red-50 p-4">
              <span className="text-sm font-semibold text-red-900">
                Rejeitadas
              </span>
              <span className="text-xl font-black text-red-700">
                {formatNumber(dashboard?.rejectedWorks)}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <Link to="/admin/manual-review">
              <PrimaryButton variant="light" icon={ClipboardCheck}>
                Ir para revisão
              </PrimaryButton>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h3 className="font-black text-slate-950">
            Checklist Google Acadêmico
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            {APP_CONFIG.googleScholarPolicy}
          </p>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

              <p className="text-sm leading-7 text-amber-900">
                O painel apenas orienta o pesquisador a revisar manualmente seu
                perfil no Google Acadêmico. As integrações automáticas permitidas
                continuam sendo ORCID, OpenAlex e Crossref.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <Link to="/admin/google-scholar-checklist">
              <PrimaryButton variant="light" icon={CheckCircle2}>
                Abrir checklist
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-black text-slate-950">ORCID</h3>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            Organize identificadores ORCID e obras associadas aos pesquisadores.
          </p>

          <div className="mt-5">
            <Link to="/admin/orcid">
              <PrimaryButton variant="light" icon={Link2}>
                Acessar ORCID
              </PrimaryButton>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-black text-slate-950">OpenAlex</h3>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            Consulte autores, candidatos e obras científicas para análise
            acadêmica.
          </p>

          <div className="mt-5">
            <Link to="/admin/openalex">
              <PrimaryButton variant="light" icon={Network}>
                Acessar OpenAlex
              </PrimaryButton>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-black text-slate-950">Crossref / DOI</h3>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            Valide DOI e metadados bibliográficos das obras acadêmicas.
          </p>

          <div className="mt-5">
            <Link to="/admin/crossref">
              <PrimaryButton variant="light" icon={LibraryBig}>
                Validar DOI
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-black text-slate-950">Última atualização</h3>

        <p className="mt-2 text-sm leading-7 text-slate-500">
          Dados consolidados a partir dos módulos acadêmicos da plataforma.
        </p>

        <p className="mt-4 text-sm font-bold text-slate-900">
          {formatDateTime(dashboard?.lastSync)}
        </p>
      </section>
    </div>
  );
}