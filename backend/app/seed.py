import asyncio
from datetime import date, timedelta

from sqlalchemy import select, update

from app.domain.models.professional import ProfessionalStatus
from app.infra.db.models import ProfessionalORM
from app.infra.db.session import AsyncSessionLocal


def build_seed_data(today: date) -> list[dict]:
    """Base com exatamente 20 profissionais. Variados status; varios com contrato vencido (INATIVO)."""
    return [
        {
            "nome": "Ana Souza",
            "email": "ana.souza@empresa.com",
            "cargo": "Engenheira de Software",
            "departamento": "Tecnologia",
            "telefone": "11999990001",
            "data_inicio": today - timedelta(days=320),
            "data_vencimento_contrato": today + timedelta(days=40),
            "observacoes": "Trabalha com APIs.",
            "status": ProfessionalStatus.ATIVO,
        },
        {
            "nome": "Carlos Lima",
            "email": "carlos.lima@empresa.com",
            "cargo": "Analista de Dados",
            "departamento": "Dados",
            "telefone": "11999990002",
            "data_inicio": today - timedelta(days=200),
            "data_vencimento_contrato": today + timedelta(days=15),
            "observacoes": "Foco em BI.",
            "status": ProfessionalStatus.LICENCIA,
        },
        {
            "nome": "Bruna Matos",
            "email": "bruna.matos@empresa.com",
            "cargo": "UX Designer",
            "departamento": "Produto",
            "telefone": "11999990003",
            "data_inicio": today - timedelta(days=410),
            "data_vencimento_contrato": today - timedelta(days=20),
            "observacoes": "Especialista em discovery.",
            "status": ProfessionalStatus.INATIVO,
        },
        {
            "nome": "Diego Nunes",
            "email": "diego.nunes@empresa.com",
            "cargo": "QA Engineer",
            "departamento": "Qualidade",
            "telefone": "11999990004",
            "data_inicio": today - timedelta(days=280),
            "data_vencimento_contrato": today + timedelta(days=8),
            "observacoes": "Automacao com Cypress.",
            "status": ProfessionalStatus.ATIVO,
        },
        {
            "nome": "Fernanda Prado",
            "email": "fernanda.prado@empresa.com",
            "cargo": "People Analyst",
            "departamento": "RH",
            "telefone": "11999990005",
            "data_inicio": today - timedelta(days=190),
            "data_vencimento_contrato": today + timedelta(days=72),
            "observacoes": "Acompanhamento de clima.",
            "status": ProfessionalStatus.INATIVO,
        },
        {
            "nome": "Gustavo Rocha",
            "email": "gustavo.rocha@empresa.com",
            "cargo": "DevOps Engineer",
            "departamento": "Infraestrutura",
            "telefone": "11999990006",
            "data_inicio": today - timedelta(days=500),
            "data_vencimento_contrato": today - timedelta(days=5),
            "observacoes": "Pipelines e observabilidade.",
            "status": ProfessionalStatus.INATIVO,
        },
        {
            "nome": "Helena Torres",
            "email": "helena.torres@empresa.com",
            "cargo": "Product Manager",
            "departamento": "Produto",
            "telefone": "11999990007",
            "data_inicio": today - timedelta(days=360),
            "data_vencimento_contrato": today + timedelta(days=120),
            "observacoes": "Roadmap de plataforma.",
            "status": ProfessionalStatus.LICENCIA,
        },
        {
            "nome": "Igor Freitas",
            "email": "igor.freitas@empresa.com",
            "cargo": "Backend Engineer",
            "departamento": "Tecnologia",
            "telefone": "11999990008",
            "data_inicio": today - timedelta(days=150),
            "data_vencimento_contrato": today + timedelta(days=3),
            "observacoes": "API e banco de dados.",
            "status": ProfessionalStatus.ATIVO,
        },
        {
            "nome": "Juliana Campos",
            "email": "juliana.campos@empresa.com",
            "cargo": "Finance Analyst",
            "departamento": "Financeiro",
            "telefone": "11999990009",
            "data_inicio": today - timedelta(days=260),
            "data_vencimento_contrato": today - timedelta(days=30),
            "observacoes": "Controle orcamentario.",
            "status": ProfessionalStatus.INATIVO,
        },
        {
            "nome": "Kleber Reis",
            "email": "kleber.reis@empresa.com",
            "cargo": "Data Engineer",
            "departamento": "Dados",
            "telefone": "11999990010",
            "data_inicio": today - timedelta(days=330),
            "data_vencimento_contrato": today - timedelta(days=1),
            "observacoes": "Pipelines em nuvem.",
            "status": ProfessionalStatus.INATIVO,
        },
        {
            "nome": "Larissa Duarte",
            "email": "larissa.duarte@empresa.com",
            "cargo": "Frontend Engineer",
            "departamento": "Tecnologia",
            "telefone": "11999990011",
            "data_inicio": today - timedelta(days=125),
            "data_vencimento_contrato": today + timedelta(days=88),
            "observacoes": "Design system e acessibilidade.",
            "status": ProfessionalStatus.ATIVO,
        },
        {
            "nome": "Marcelo Pinto",
            "email": "marcelo.pinto@empresa.com",
            "cargo": "Security Analyst",
            "departamento": "Seguranca",
            "telefone": "11999990012",
            "data_inicio": today - timedelta(days=420),
            "data_vencimento_contrato": today - timedelta(days=45),
            "observacoes": "Gestao de riscos.",
            "status": ProfessionalStatus.INATIVO,
        },
        {
            "nome": "Nathalia Araujo",
            "email": "nathalia.araujo@empresa.com",
            "cargo": "Scrum Master",
            "departamento": "Agilidade",
            "telefone": "11999990013",
            "data_inicio": today - timedelta(days=300),
            "data_vencimento_contrato": today + timedelta(days=27),
            "observacoes": "Facilitacao de squads.",
            "status": ProfessionalStatus.ATIVO,
        },
        {
            "nome": "Otavio Ribeiro",
            "email": "otavio.ribeiro@empresa.com",
            "cargo": "Support Specialist",
            "departamento": "Suporte",
            "telefone": "11999990014",
            "data_inicio": today - timedelta(days=210),
            "data_vencimento_contrato": today - timedelta(days=12),
            "observacoes": "Atendimento de incidentes.",
            "status": ProfessionalStatus.INATIVO,
        },
        {
            "nome": "Patricia Faria",
            "email": "patricia.faria@empresa.com",
            "cargo": "Tech Recruiter",
            "departamento": "RH",
            "telefone": "11999990015",
            "data_inicio": today - timedelta(days=90),
            "data_vencimento_contrato": today + timedelta(days=140),
            "observacoes": "Recrutamento de perfis tech.",
            "status": ProfessionalStatus.ATIVO,
        },
        {
            "nome": "Rafael Costa",
            "email": "rafael.costa@empresa.com",
            "cargo": "Mobile Developer",
            "departamento": "Tecnologia",
            "telefone": "11999990016",
            "data_inicio": today - timedelta(days=70),
            "data_vencimento_contrato": today + timedelta(days=95),
            "observacoes": "React Native.",
            "status": ProfessionalStatus.ATIVO,
        },
        {
            "nome": "Sandra Oliveira",
            "email": "sandra.oliveira@empresa.com",
            "cargo": "Compliance Analyst",
            "departamento": "Juridico",
            "telefone": "11999990017",
            "data_inicio": today - timedelta(days=400),
            "data_vencimento_contrato": today - timedelta(days=8),
            "observacoes": "LGPD e processos.",
            "status": ProfessionalStatus.INATIVO,
        },
        {
            "nome": "Thiago Martins",
            "email": "thiago.martins@empresa.com",
            "cargo": "Infra Engineer",
            "departamento": "Infraestrutura",
            "telefone": "11999990018",
            "data_inicio": today - timedelta(days=180),
            "data_vencimento_contrato": today - timedelta(days=90),
            "observacoes": "Cloud e redes.",
            "status": ProfessionalStatus.INATIVO,
        },
        {
            "nome": "Ursula Becker",
            "email": "ursula.becker@empresa.com",
            "cargo": "Customer Success",
            "departamento": "Produto",
            "telefone": "11999990019",
            "data_inicio": today - timedelta(days=95),
            "data_vencimento_contrato": today + timedelta(days=270),
            "observacoes": "Onboarding de clientes.",
            "status": ProfessionalStatus.ATIVO,
        },
        {
            "nome": "Vinicius Alves",
            "email": "vinicius.alves@empresa.com",
            "cargo": "Tech Lead",
            "departamento": "Tecnologia",
            "telefone": "11999990020",
            "data_inicio": today - timedelta(days=550),
            "data_vencimento_contrato": today + timedelta(days=35),
            "observacoes": "Lideranca tecnica.",
            "status": ProfessionalStatus.ATIVO,
        },
    ]


async def seed() -> None:
    async with AsyncSessionLocal() as session:
        today = date.today()

        # Remove opções "teste" dos filtros: atualiza registros que foram criados em teste
        await session.execute(
            update(ProfessionalORM).where(ProfessionalORM.cargo == "teste").values(cargo="Engenheira de Software")
        )
        await session.execute(
            update(ProfessionalORM).where(ProfessionalORM.departamento == "teste").values(departamento="Tecnologia")
        )

        entries = build_seed_data(today)
        emails = [entry["email"] for entry in entries]

        existing_result = await session.execute(
            select(ProfessionalORM.email).where(ProfessionalORM.email.in_(emails))
        )
        existing_emails = {email for email in existing_result.scalars().all()}

        for entry in entries:
            if entry["email"] in existing_emails:
                continue
            session.add(ProfessionalORM(**entry))

        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
