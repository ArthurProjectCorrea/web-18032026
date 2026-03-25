'use client';

import * as React from 'react';
import { type SeeuService } from '@/types/seeu-service';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { maskCpf, maskPhone, maskLawsuit } from '@/lib/utils';

interface AttendanceFormProps {
  data: SeeuService;
}

export function AttendanceForm({ data }: AttendanceFormProps) {
  const lawsuit = data.lawsuit;
  const person = lawsuit?.person;

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });
    } catch {
      return '___/___/______';
    }
  };

  const getFullAddress = () => {
    const addr = data.address;
    if (!addr) return 'Não informado';

    // Se for um endereço manual
    if (addr.not_cep) return addr.not_cep;

    const parts = [
      addr.cep?.street,
      addr.number ? `nº ${addr.number}` : null,
      addr.complement,
      addr.cep?.neighborhood,
      addr.cep?.city,
      addr.cep?.state,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(', ') : 'Não informado';
  };

  return (
    <div className="mx-auto max-w-[800px] bg-white p-8 font-sans leading-tight text-black print:p-0">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="text-[11px] font-bold uppercase">
          <p>Governo do Estado de Mato Grosso</p>
          <p>Secretaria de Estado de Justiça</p>
          <p>Fundação Nova Chance - FUNAC</p>
        </div>
      </div>

      {/* Title */}
      <h1 className="mb-8 text-center text-2xl font-black tracking-tighter uppercase">
        TERMO DE COMPARECIMENTO
      </h1>

      {/* Introduction */}
      <div className="mb-6 text-justify text-lg">
        <p>
          No dia{' '}
          <span className="font-bold">{formatDate(data.created_at)}</span>, na
          Fundação Nova Chance – FUNAC, compareceu espontaneamente o(a)
          Senhor(a) abaixo qualificado(a), para assinatura do termo de
          comparecimento obrigatório e informar trabalho lícito e endereço
          atualizado.
        </p>
      </div>

      {/* Data Section */}
      <div className="mb-6 space-y-1 text-lg">
        <div>
          <span className="font-bold">Nº Processo:</span>{' '}
          {maskLawsuit(lawsuit?.number || '')}
        </div>
        <div>
          <span className="font-bold">Nome:</span> {person?.name}
        </div>
        <div>
          <span className="font-bold">CPF:</span> {maskCpf(person?.cpf || '')}
        </div>
        <div>
          <span className="font-bold">Nome da Mãe:</span> {person?.mothers_name}
        </div>
        <div>
          <span className="font-bold">Telefone:</span>{' '}
          {data.telephone
            ? maskPhone(data.telephone.telephone)
            : 'Não informado'}
        </div>
        <div>
          <span className="font-bold">Endereço:</span> {getFullAddress()}
        </div>
      </div>

      {/* Questionnaire Section */}
      <div className="mb-6 space-y-1 text-lg">
        <p>
          <span className="font-bold">
            Apresentou comprovante de Residência:
          </span>{' '}
          {data.proof_of_residence}
        </p>
        <p>
          <span className="font-bold">Trabalho Lícito:</span>{' '}
          {data.proof_of_employment}
          {data.proof_of_legal_waiver &&
            data.proof_of_legal_waiver !== 'Não' && (
              <span> ({data.proof_of_legal_waiver})</span>
            )}
        </p>
      </div>

      {/* Admoestação */}
      <div className="mb-6 text-justify text-lg leading-relaxed">
        <p>
          <span className="font-bold uppercase underline">ADMOESTAÇÃO</span>:
          Ciente da obrigatoriedade de apresentação do comprovante de trabalho
          lícito e de endereço atualizado, de procurar a equipe técnica da FUNAC
          para acessar vagas de trabalho e qualificação profissional, sob pena
          de consequências como a não concessão de benefícios, progressão ou
          regressão de regime, com expedição de mandado.
        </p>
      </div>

      <div className="mb-6 text-lg font-bold">
        É a Primeira Assinatura: {data.is_first_signature ? 'Sim' : 'Não'}
      </div>

      {/* Closing */}
      <div className="mb-10 text-justify text-lg leading-relaxed">
        <p>
          Nada mais havendo a declarar, lavrou-se o presente termo, lavrado por
          este servidor(a) e assinado e pelo(a) comparecente, para que produza
          os efeitos legais cabíveis.
        </p>
      </div>

      {/* Footer Info */}
      <div className="border-t border-black pt-2 text-center text-sm font-bold italic">
        <p>
          COMPARECIMENTO: Letras A I- de 01 a 14ª e letras J a Z, de 15 a 30/31
          do mês - Serão distribuídas 300 senhas diárias – NÃO DEIXE PARA A
          ÚLTIMA HORA
        </p>
      </div>
    </div>
  );
}
