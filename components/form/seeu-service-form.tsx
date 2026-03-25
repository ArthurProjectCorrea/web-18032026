'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import {
  getPersonByCpf,
  createFullPerson,
  createSeeuService,
  checkMonthlySignatureAction,
} from '@/lib/actions/seeu-actions';
import { fetchApi } from '@/lib/api';
import { Save, Printer } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  IdentificationSection,
  LawsuitSection,
  ContactSection,
  QuestionnaireSection,
} from './seeu-service-sections';
import { AttendanceForm } from '@/components/template/attendance-form';

import {
  Person,
  Lawsuit,
  Telephone,
  Address,
  QuestionnaireData,
  SeeuService,
} from '@/types/seeu-service';

interface FormProps {
  schooling: { id: number; name: string }[];
  penaltyRegimes: { id: number; name: string }[];
  initialData?: SeeuService | null;
}

export function SeeuServiceForm({
  schooling,
  penaltyRegimes,
  initialData,
}: FormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDuplicateAlert, setShowDuplicateAlert] = React.useState(false);

  // --- Data State ---
  const [person, setPerson] = React.useState<Person | null>(null);
  const [lawsuits, setLawsuits] = React.useState<Lawsuit[]>([]);
  const [selectedLawsuit, setSelectedLawsuit] = React.useState<Lawsuit | null>(
    null
  );
  const [contacts, setContacts] = React.useState<{
    telephones: Telephone[];
    addresses: Address[];
  }>({ telephones: [], addresses: [] });

  // --- Form States ---
  const [cpf, setCpf] = React.useState('');
  const [personForm, setPersonForm] = React.useState<Person>({
    name: '',
    mothers_name: '',
    fathers_name: '',
    date_of_birth: '',
    schooling_id: 0,
    cpf: '',
  });

  const [showLawsuitForm, setShowLawsuitForm] = React.useState(false);
  const [newLawsuit, setNewLawsuit] = React.useState<Partial<Lawsuit>>({
    number: '',
    regime_progression: '',
    penalty_regime_id: 0,
  });

  const [newPhone, setNewPhone] = React.useState('');
  const [selectedTelephoneId, setSelectedTelephoneId] = React.useState<
    number | null
  >(null);
  const [selectedAddressId, setSelectedAddressId] = React.useState<
    number | null
  >(null);
  const [newAddress, setNewAddress] = React.useState<Partial<Address>>({});

  const [questionnaire, setQuestionnaire] = React.useState<QuestionnaireData>({
    proof_of_residence: '',
    proof_of_employment: '',
    proof_of_legal_waiver: '',
  });

  // --- Initial Population ---
  React.useEffect(() => {
    if (initialData) {
      const p = initialData.lawsuit?.person;
      if (p) {
        setPerson(p);
        setPersonForm({
          name: p.name,
          mothers_name: p.mothers_name,
          fathers_name: p.fathers_name || '',
          date_of_birth: p.date_of_birth,
          schooling_id: p.schooling_id,
          cpf: p.cpf,
        });
        setCpf(p.cpf);
        setLawsuits(p.lawsuits || []);
        setContacts({
          telephones: p.telephones || [],
          addresses: p.addresses || [],
        });
        setSelectedLawsuit(initialData.lawsuit || null);

        // Match selected contact IDs if they exist
        if (initialData.telephone_id) {
          const idx = (p.telephones || []).findIndex(
            (t) => t.id === initialData.telephone_id
          );
          if (idx !== -1) setSelectedTelephoneId(idx);
        }
        if (initialData.address_id) {
          const idx = (p.addresses || []).findIndex(
            (a) => a.id === initialData.address_id
          );
          if (idx !== -1) setSelectedAddressId(idx);
        }
      }
      setQuestionnaire({
        proof_of_residence: initialData.proof_of_residence,
        proof_of_employment: initialData.proof_of_employment,
        proof_of_legal_waiver: initialData.proof_of_legal_waiver || '',
      });
    }
  }, [initialData]);

  // --- Handlers ---
  const handleCpfSearch = async () => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return toast.error('CPF inválido');

    setIsLoading(true);
    try {
      const p = await getPersonByCpf(cleanCpf);
      if (p) {
        setPerson(p);
        setPersonForm({
          name: p.name,
          mothers_name: p.mothers_name,
          fathers_name: p.fathers_name || '',
          date_of_birth: p.date_of_birth,
          schooling_id: p.schooling_id,
          cpf: p.cpf,
        });
        setLawsuits(p.lawsuits || []);
        setContacts({
          telephones: p.telephones || [],
          addresses: p.addresses || [],
        });
        if (p.lawsuits?.length === 1) setSelectedLawsuit(p.lawsuits[0]);
        toast.success('Pessoa localizada!');
      } else {
        setPerson(null);
        setLawsuits([]);
        setContacts({ telephones: [], addresses: [] });
        toast.info('Pessoa não cadastrada.');
      }
    } catch {
      toast.error('Erro na busca');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLawsuit = async () => {
    if (
      !newLawsuit.number ||
      !newLawsuit.penalty_regime_id ||
      !newLawsuit.regime_progression
    ) {
      return toast.error('Preencha os dados do processo');
    }

    // Se a pessoa já existe, salvamos o processo no banco agora
    if (person?.id) {
      setIsLoading(true);
      try {
        const law = await fetchApi(`/api/admin/people/${person.id}/lawsuits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            number: newLawsuit.number,
            penalty_regime_id: newLawsuit.penalty_regime_id,
            regime_progression: newLawsuit.regime_progression,
          }),
        });
        setLawsuits([...lawsuits, law]);
        setSelectedLawsuit(law);
        setShowLawsuitForm(false);
        setNewLawsuit({
          number: '',
          regime_progression: '',
          penalty_regime_id: 0,
        });
        toast.success('Processo adicionado!');
      } catch (e: unknown) {
        const err = e as Error;
        toast.error(err.message || 'Erro ao adicionar processo');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Se a pessoa não existe, apenas adicionamos na lista local (será criado no final)
      const tempId = `temp-${Date.now()}`;
      const law: Lawsuit = {
        id: tempId,
        number: newLawsuit.number!,
        penalty_regime_id: newLawsuit.penalty_regime_id!,
        regime_progression: newLawsuit.regime_progression!,
        penalty_regime: penaltyRegimes.find(
          (r) => r.id === newLawsuit.penalty_regime_id
        ),
      };
      setLawsuits([...lawsuits, law]);
      setSelectedLawsuit(law);
      setShowLawsuitForm(false);
      setNewLawsuit({
        number: '',
        regime_progression: '',
        penalty_regime_id: 0,
      });
    }
  };

  const handleAddPhone = async () => {
    if (!newPhone) return;
    if (person?.id) {
      setIsLoading(true);
      try {
        const tel = await fetchApi(
          `/api/admin/people/${person.id}/telephones`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telephone: newPhone }),
          }
        );
        setContacts((prev) => ({
          ...prev,
          telephones: [...prev.telephones, tel],
        }));
        setNewPhone('');
      } catch (e: unknown) {
        const err = e as Error;
        toast.error(err.message || 'Erro ao adicionar telefone');
      } finally {
        setIsLoading(false);
      }
    } else {
      setContacts((prev) => ({
        ...prev,
        telephones: [...prev.telephones, { telephone: newPhone }],
      }));
      setNewPhone('');
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.not_cep && !newAddress.cep_id)
      return toast.error('Busque um CEP ou informe o endereço manually.');
    if (person?.id) {
      setIsLoading(true);
      try {
        const payload = {
          cep_id: newAddress.cep_id,
          not_cep: newAddress.not_cep,
          number: newAddress.number,
          complement: newAddress.complement,
        };
        const addr = await fetchApi(
          `/api/admin/people/${person.id}/addresses`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        setContacts((prev) => ({
          ...prev,
          addresses: [...prev.addresses, addr],
        }));
        setNewAddress({});
      } catch (e: unknown) {
        const err = e as Error;
        toast.error(err.message || 'Erro ao adicionar endereço');
      } finally {
        setIsLoading(false);
      }
    } else {
      setContacts((prev) => ({
        ...prev,
        addresses: [...prev.addresses, { ...newAddress }],
      }));
      setNewAddress({});
    }
  };

  const handleSubmit = async (forceBypass = false) => {
    if (!selectedLawsuit) return toast.error('Selecione um processo');
    if (
      !questionnaire.proof_of_residence ||
      !questionnaire.proof_of_employment
    ) {
      return toast.error('Preencha o questionário');
    }

    if (!forceBypass && person?.id) {
      setIsLoading(true);
      const isDuplicate = await checkMonthlySignatureAction(
        cpf.replace(/\D/g, ''),
        selectedLawsuit.number
      );
      setIsLoading(false);

      if (isDuplicate) {
        setShowDuplicateAlert(true);
        return;
      }
    }

    setIsLoading(true);
    try {
      let finalLawsuitId = selectedLawsuit.id;

      // 1. Se a pessoa não existe, cria tudo atomicamente
      if (!person?.id) {
        const fullPerson = await createFullPerson({
          ...personForm,
          cpf: cpf.replace(/\D/g, ''),
          lawsuits: lawsuits.map((l) => ({
            number: l.number,
            penalty_regime_id: l.penalty_regime_id,
            regime_progression: l.regime_progression,
          })),
          telephones: contacts.telephones.map((t) => t.telephone),
          addresses: contacts.addresses.map((a) => ({
            cep_id: a.cep_id,
            not_cep: a.not_cep,
            number: a.number,
            complement: a.complement,
          })),
        });

        // Encontra o ID do processo que estava selecionado
        const createdLawsuit = fullPerson.lawsuits.find(
          (l: { number: string }) =>
            l.number === (selectedLawsuit?.number || '')
        );
        finalLawsuitId = createdLawsuit.id;
      }

      // 2. Cria o registro de atendimento
      await createSeeuService({
        lawsuit_id: finalLawsuitId!,
        proof_of_residence: questionnaire.proof_of_residence,
        proof_of_employment: questionnaire.proof_of_employment,
        proof_of_legal_waiver: questionnaire.proof_of_legal_waiver,
        // Optional contact selection
        ...(selectedTelephoneId !== null && {
          telephone_id: contacts.telephones[selectedTelephoneId]?.id,
        }),
        ...(selectedAddressId !== null && {
          address_id: contacts.addresses[selectedAddressId]?.id,
        }),
      });

      toast.success('Atendimento registrado com sucesso!');
      router.push('/seeu-service');
      router.refresh();
    } catch (e: unknown) {
      const err = e as Error;
      toast.error(err.message || 'Erro ao salvar atendimento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <IdentificationSection
          cpf={cpf}
          setCpf={setCpf}
          personForm={personForm}
          setPersonForm={setPersonForm}
          isLoading={isLoading}
          schooling={schooling}
          handleCpfSearch={handleCpfSearch}
          isEditMode={!!initialData}
          isPersonExisting={!!person?.id}
        />

        <LawsuitSection
          lawsuits={lawsuits}
          selectedLawsuit={selectedLawsuit}
          setSelectedLawsuit={setSelectedLawsuit}
          newLawsuit={newLawsuit}
          setNewLawsuit={setNewLawsuit}
          showForm={showLawsuitForm}
          setShowForm={setShowLawsuitForm}
          penaltyRegimes={penaltyRegimes}
          isLoading={isLoading}
          onEdit={() => {}}
          onSave={handleAddLawsuit}
          onDelete={() => {}} // TODO: Implement delete if needed
          isEditMode={!!initialData}
          isPersonExisting={!!person?.id}
        />

        <ContactSection
          contacts={contacts}
          selectedTelephoneId={selectedTelephoneId}
          setSelectedTelephoneId={setSelectedTelephoneId}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          newPhone={newPhone}
          setNewPhone={setNewPhone}
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          isLoading={isLoading}
          onAddPhone={handleAddPhone}
          onAddManual={handleAddAddress}
          onDeletePhone={(idx) =>
            setContacts((prev) => ({
              ...prev,
              telephones: prev.telephones.filter((_, i) => i !== idx),
            }))
          }
          onDeleteAddress={(idx) =>
            setContacts((prev) => ({
              ...prev,
              addresses: prev.addresses.filter((_, i) => i !== idx),
            }))
          }
          isEditMode={!!initialData}
          isPersonExisting={!!person?.id}
        />

        <QuestionnaireSection
          questionnaire={questionnaire}
          setQuestionnaire={setQuestionnaire}
          isLoading={isLoading}
        />
      </div>

      <div className="mt-8 flex items-center justify-end gap-4 border-t pt-6">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="px-8 font-bold"
        >
          Cancelar
        </Button>
        <Button
          variant="secondary"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(false);
          }}
          disabled={isLoading || !selectedLawsuit}
          className="gap-2 font-bold shadow-sm"
        >
          <Printer className="h-4 w-4" /> Salvar e Imprimir
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(false);
          }}
          disabled={isLoading || !selectedLawsuit}
          className="min-w-[200px] gap-2 font-bold shadow-sm"
        >
          {isLoading ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salvar Atendimento
        </Button>
      </div>

      {/* Hidden print area */}
      <div className="fixed top-[-9999px] left-[-9999px]">
        {selectedLawsuit && (
          <div id="attendance-print">
            <AttendanceForm
              data={
                {
                  id: 'temp',
                  created_at: new Date().toISOString(),
                  lawsuit: selectedLawsuit,
                  lawsuit_id: selectedLawsuit.id || '',
                  proof_of_residence: questionnaire.proof_of_residence,
                  proof_of_employment: questionnaire.proof_of_employment,
                  proof_of_legal_waiver: questionnaire.proof_of_legal_waiver,
                  is_first_signature: initialData?.is_first_signature ?? true,
                  telephone:
                    selectedTelephoneId !== null
                      ? contacts.telephones[selectedTelephoneId]
                      : null,
                  address:
                    selectedAddressId !== null
                      ? contacts.addresses[selectedAddressId]
                      : null,
                  creator_profile: initialData?.creator_profile,
                } as unknown as SeeuService
              }
            />
          </div>
        )}
      </div>

      <AlertDialog
        open={showDuplicateAlert}
        onOpenChange={setShowDuplicateAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assinatura Duplicada no Mês</AlertDialogTitle>
            <AlertDialogDescription>
              Identificamos que já existe um registro de comparecimento para
              esta pessoa neste mesmo processo durante o mês atual. Deseja
              registrar outro atendimento mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                setShowDuplicateAlert(false);
                handleSubmit(true);
              }}
              disabled={isLoading}
            >
              Registrar Mesmo Assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
