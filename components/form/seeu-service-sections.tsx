'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Search,
  Plus,
  FileText,
  Check,
  Pencil,
  Trash2,
  Phone,
  MapPin,
  Copy,
  Loader2,
} from 'lucide-react';
import { cn, maskCpf, maskPhone, maskLawsuit, maskCep } from '@/lib/utils';
import { searchCepAction } from '@/lib/actions/seeu-actions';
import {
  Person,
  Lawsuit,
  Telephone,
  Address,
  QuestionnaireData,
} from '@/types/seeu-service';

// --- Section 1: Identification ---
export function IdentificationSection({
  cpf,
  setCpf,
  personForm,
  setPersonForm,
  isLoading,
  schooling,
  handleCpfSearch,
  isEditMode,
  isPersonExisting,
  forceEditable,
  hideSearch,
}: {
  cpf: string;
  setCpf: (v: string) => void;
  personForm: Person;
  setPersonForm: (v: Person) => void;
  isLoading: boolean;
  schooling: { id: number; name: string }[];
  handleCpfSearch: () => void;
  isEditMode: boolean;
  isPersonExisting: boolean;
  forceEditable?: boolean;
  hideSearch?: boolean;
}) {
  const isIdentReadOnly = !forceEditable && (isEditMode || isPersonExisting);

  return (
    <Card className="border-primary/10 flex h-full flex-col shadow-sm">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <CardTitle className="text-base font-semibold tracking-tight uppercase">
          Identificação da Pessoa
        </CardTitle>
        <CardDescription>
          Busque pelo CPF ou preencha os dados manuais para registro.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 pt-6">
        <Field>
          <FieldLabel className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
            CPF do Atendido
          </FieldLabel>
          <div className="flex gap-2">
            <Input
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(maskCpf(e.target.value))}
              disabled={isLoading || isIdentReadOnly}
              maxLength={14}
              className="bg-muted/30 flex-1"
              autoComplete="off"
            />
            {!isEditMode && !hideSearch && (
              <Button
                onClick={handleCpfSearch}
                disabled={isLoading || cpf.length < 14}
                size="icon"
                className="w-10 shrink-0"
              >
                {isLoading ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </Field>
        <Field>
          <FieldLabel className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
            Nome Completo *
          </FieldLabel>
          <Input
            value={personForm.name}
            onChange={(e) =>
              setPersonForm({ ...personForm, name: e.target.value })
            }
            disabled={isLoading || isIdentReadOnly}
            autoComplete="off"
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
              Nome da Mãe *
            </FieldLabel>
            <Input
              value={personForm.mothers_name}
              onChange={(e) =>
                setPersonForm({ ...personForm, mothers_name: e.target.value })
              }
              disabled={isLoading || isIdentReadOnly}
              autoComplete="off"
            />
          </Field>
          <Field>
            <FieldLabel className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
              Nome do Pai
            </FieldLabel>
            <Input
              value={personForm.fathers_name || ''}
              onChange={(e) =>
                setPersonForm({ ...personForm, fathers_name: e.target.value })
              }
              disabled={isLoading || isIdentReadOnly}
              autoComplete="off"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
              Data de Nascimento *
            </FieldLabel>
            <DatePicker
              date={personForm.date_of_birth}
              setDate={(v) =>
                setPersonForm({ ...personForm, date_of_birth: v })
              }
              disabled={isLoading || isIdentReadOnly}
            />
          </Field>
          <Field>
            <FieldLabel className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
              Escolaridade *
            </FieldLabel>
            <Select
              value={personForm.schooling_id?.toString()}
              onValueChange={(v) =>
                setPersonForm({ ...personForm, schooling_id: parseInt(v) })
              }
              disabled={isLoading || isIdentReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {schooling.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Section 2: Lawsuits ---
export function LawsuitSection({
  lawsuits,
  selectedLawsuit,
  setSelectedLawsuit,
  newLawsuit,
  setNewLawsuit,
  showForm,
  setShowForm,
  penaltyRegimes,
  isLoading,
  onEdit,
  onSave,
  onDelete,
  isEditMode,
  isPersonExisting,
  forceEditable,
}: {
  lawsuits: Lawsuit[];
  selectedLawsuit: Lawsuit | null;
  setSelectedLawsuit: (l: Lawsuit | null) => void;
  newLawsuit: Partial<Lawsuit>;
  setNewLawsuit: (l: Partial<Lawsuit>) => void;
  showForm: boolean;
  setShowForm: (v: boolean) => void;
  penaltyRegimes: { id: number; name: string }[];
  isLoading: boolean;
  onEdit: (l: Lawsuit) => void;
  onSave: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  isEditMode: boolean;
  isPersonExisting: boolean;
  forceEditable?: boolean;
}) {
  const canAdd = !isEditMode || forceEditable;
  const canDelete = forceEditable || (!isEditMode && !isPersonExisting);

  return (
    <Card className="border-primary/10 flex h-full flex-col shadow-sm">
      <CardHeader className="bg-muted/30 flex flex-row items-center justify-between space-y-0 border-b pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold tracking-tight uppercase">
            Processos e Regimes
          </CardTitle>
          <CardDescription>
            Vincule processos ativos ao atendimento.
          </CardDescription>
        </div>
        {!showForm && canAdd && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            disabled={isLoading}
            className="gap-2 font-semibold"
          >
            <Plus className="h-4 w-4" /> Novo
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-4 pt-6">
        {showForm ? (
          <div className="bg-muted/40 border-primary/20 animate-in fade-in slide-in-from-top-2 space-y-4 rounded-xl border p-4 shadow-inner duration-300">
            <Field>
              <FieldLabel className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
                Número do Processo *
              </FieldLabel>
              <Input
                placeholder="0000000-00.0000.0.00.0000"
                value={newLawsuit.number}
                onChange={(e) =>
                  setNewLawsuit({
                    ...newLawsuit,
                    number: maskLawsuit(e.target.value),
                  })
                }
                maxLength={25}
                className="bg-background"
                autoComplete="off"
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
                  Regime Peniten. *
                </FieldLabel>
                <Select
                  value={newLawsuit.penalty_regime_id?.toString()}
                  onValueChange={(v) =>
                    setNewLawsuit({
                      ...newLawsuit,
                      penalty_regime_id: parseInt(v),
                    })
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Regime..." />
                  </SelectTrigger>
                  <SelectContent>
                    {penaltyRegimes.map((r) => (
                      <SelectItem key={r.id} value={r.id.toString()}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
                  Data Progressão *
                </FieldLabel>
                <DatePicker
                  date={newLawsuit.regime_progression}
                  setDate={(v) =>
                    setNewLawsuit({ ...newLawsuit, regime_progression: v })
                  }
                />
              </Field>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={onSave}
                disabled={isLoading}
                className="font-bold"
              >
                Salvar Processo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {lawsuits.length === 0 ? (
              <p className="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-sm italic">
                Nenhum processo vinculado.
              </p>
            ) : (
              lawsuits.map((law) => (
                <div
                  key={law.id}
                  onClick={() => setSelectedLawsuit(law)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-xl border-2 p-3.5 transition-all duration-200',
                    selectedLawsuit?.id === law.id
                      ? 'bg-primary/5 border-primary shadow-sm'
                      : 'hover:bg-muted border-border/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                        selectedLawsuit?.id === law.id
                          ? 'bg-primary shadow-primary/20 text-white shadow-md'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold tracking-tight">
                          {law.number}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary h-6 w-6 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(law.number);
                            toast.success('Número do processo copiado!');
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-muted-foreground text-xs font-semibold">
                        {law.penalty_regime?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(!isEditMode || forceEditable) && (
                      <>
                        {(forceEditable || !isPersonExisting) && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary border-border/50 w-8 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(law);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="hover:bg-destructive/10 hover:text-destructive border-border/50 w-8 transition-colors"
                            onClick={(e) => law.id && onDelete(law.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                    {selectedLawsuit?.id === law.id && (
                      <div className="bg-primary ml-1 rounded-full p-0.5 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Section 3: Contacts ---
export function ContactSection({
  contacts,
  selectedTelephoneId,
  setSelectedTelephoneId,
  selectedAddressId,
  setSelectedAddressId,
  newPhone,
  setNewPhone,
  newAddress,
  setNewAddress,
  isLoading,
  onAddPhone,
  onAddManual,
  onDeletePhone,
  onDeleteAddress,
  isEditMode,
  isPersonExisting,
  forceEditable,
}: {
  contacts: { telephones: Telephone[]; addresses: Address[] };
  selectedTelephoneId: number | null;
  setSelectedTelephoneId: (v: number | null) => void;
  selectedAddressId: number | null;
  setSelectedAddressId: (v: number | null) => void;
  newPhone: string;
  setNewPhone: (v: string) => void;
  newAddress: Partial<Address>;
  setNewAddress: React.Dispatch<React.SetStateAction<Partial<Address>>>;
  isLoading: boolean;
  onAddPhone: () => void;
  onAddManual: () => void;
  onDeletePhone: (id: number, e: React.MouseEvent) => void;
  onDeleteAddress: (id: number, e: React.MouseEvent) => void;
  isEditMode: boolean;
  isPersonExisting: boolean;
  forceEditable?: boolean;
}) {
  const [isSearchingCep, setIsSearchingCep] = React.useState(false);
  const [cepInput, setCepInput] = React.useState('');
  const [streetInput, setStreetInput] = React.useState('');
  const [districtInput, setDistrictInput] = React.useState('');
  const [cityInput, setCityInput] = React.useState('');
  const [stateInput, setStateInput] = React.useState('');

  const canAdd = !isEditMode || forceEditable;
  const canDelete = forceEditable || (!isEditMode && !isPersonExisting);

  const handleSearchCep = async () => {
    if (cepInput.replace(/\D/g, '').length !== 8) return;
    setIsSearchingCep(true);
    try {
      const result = await searchCepAction(cepInput);
      if (result) {
        setNewAddress({
          ...newAddress,
          cep_id: result.id,
          cep: result,
          not_cep: null,
        });
        setStreetInput(result.street || '');
        setDistrictInput(result.neighborhood || '');
        setCityInput(result.city || '');
        setStateInput(result.state || '');
      } else {
        // Fallback or not found
        setNewAddress({
          ...newAddress,
          cep_id: null,
          not_cep: `CEP ${cepInput} não encontrado`,
        });
        setStreetInput('');
        setDistrictInput('');
        setCityInput('');
        setStateInput('');
      }
    } finally {
      setIsSearchingCep(false);
    }
  };

  const syncManualAddress = () => {
    if (!newAddress.cep_id) {
      setNewAddress({
        ...newAddress,
        not_cep:
          `${streetInput || ''}, ${districtInput || ''}, ${cityInput || ''} - ${stateInput || ''} (CEP: ${cepInput || 'Não informado'})`.trim(),
      });
    }
  };

  return (
    <Card className="border-primary/10 flex h-full flex-col shadow-sm">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <CardTitle className="text-base font-semibold tracking-tight uppercase">
          Contatos e Endereço
        </CardTitle>
        <CardDescription>
          Informações para localização e contato com o atendido.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-6 pt-6">
        <div className="space-y-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
              Telefones vinculados
            </span>
          </div>
          {canAdd && (
            <Field>
              <div className="flex gap-2">
                <Input
                  placeholder="(00) 0 0000-0000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(maskPhone(e.target.value))}
                  maxLength={15}
                  className="bg-muted/30 flex-1"
                  autoComplete="off"
                />
                <Button
                  size="icon"
                  onClick={onAddPhone}
                  disabled={isLoading || newPhone.length < 14}
                  className="w-10 shrink-0 shadow-sm"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </Field>
          )}
          <div className="space-y-2 pt-1">
            {contacts.telephones.length === 0 ? (
              <p className="text-muted-foreground rounded-lg border border-dashed py-2 text-center text-[11px] italic">
                Nenhum telefone.
              </p>
            ) : (
              contacts.telephones.map((t, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-xl border-2 p-2.5 transition-all duration-200',
                    selectedTelephoneId === idx
                      ? 'bg-primary/5 border-primary shadow-sm'
                      : 'hover:bg-muted border-border/50'
                  )}
                  onClick={() =>
                    setSelectedTelephoneId(
                      idx === selectedTelephoneId ? null : idx
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                        selectedTelephoneId === idx
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <Phone className="h-4 w-4" />
                    </div>
                    <span
                      className={cn(
                        'text-sm font-bold tracking-tight',
                        selectedTelephoneId === idx
                          ? 'text-primary'
                          : 'text-foreground'
                      )}
                    >
                      {maskPhone(t.telephone)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {canDelete && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border/50 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePhone(idx, e);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-border/50 space-y-3 border-t-2 border-dashed pt-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
              Endereços vinculados
            </span>
          </div>
          {canAdd && (
            <div className="bg-muted/10 border-border/50 space-y-3 rounded-lg border p-3">
              <div className="flex gap-2">
                <Input
                  placeholder="CEP"
                  value={cepInput}
                  onChange={(e) => setCepInput(maskCep(e.target.value))}
                  onBlur={handleSearchCep}
                  maxLength={9}
                  className="bg-background w-32"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSearchCep}
                  disabled={
                    isSearchingCep || cepInput.replace(/\\D/g, '').length !== 8
                  }
                  className="shrink-0"
                >
                  {isSearchingCep ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                <Input
                  placeholder="Rua/Avenida"
                  value={streetInput}
                  onChange={(e) => {
                    setStreetInput(e.target.value);
                    syncManualAddress();
                  }}
                  className="bg-background md:col-span-2 lg:col-span-2"
                />
                <Input
                  placeholder="Número"
                  value={newAddress.number || ''}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, number: e.target.value })
                  }
                  className="bg-background"
                />
                <Input
                  placeholder="Bairro"
                  value={districtInput}
                  onChange={(e) => {
                    setDistrictInput(e.target.value);
                    syncManualAddress();
                  }}
                  className="bg-background"
                />
                <Input
                  placeholder="Complemento"
                  value={newAddress.complement || ''}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, complement: e.target.value })
                  }
                  className="bg-background md:col-span-1 lg:col-span-2"
                />
                <Input
                  placeholder="Cidade"
                  value={cityInput}
                  onChange={(e) => {
                    setCityInput(e.target.value);
                    syncManualAddress();
                  }}
                  className="bg-background"
                />
                <Input
                  placeholder="UF"
                  value={stateInput}
                  onChange={(e) => {
                    setStateInput(e.target.value);
                    syncManualAddress();
                  }}
                  maxLength={2}
                  className="bg-background"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    syncManualAddress();
                    onAddManual();
                    // reset inputs after adding
                    setTimeout(() => {
                      setCepInput('');
                      setStreetInput('');
                      setDistrictInput('');
                      setCityInput('');
                      setStateInput('');
                    }, 100);
                  }}
                  disabled={isLoading || (!newAddress.cep_id && !streetInput)}
                  className="shadow-sm"
                >
                  Confirmar Endereço
                </Button>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {contacts.addresses.length === 0 ? (
              <p className="text-muted-foreground rounded-lg border border-dashed py-2 text-center text-[11px] italic">
                Nenhum endereço.
              </p>
            ) : (
              contacts.addresses.map((a, idx) => {
                const isCep = !!a.cep_id || !!a.cep;
                const addrLabel = isCep
                  ? `${a.cep?.street || 'Local'}, ${a.number || 'S/N'}, ${a.cep?.neighborhood || 'Bairro'} - ${a.cep?.city || 'Cidade'}/${a.cep?.state || 'UF'}`
                  : a.not_cep;

                return (
                  <div
                    key={idx}
                    onClick={() =>
                      setSelectedAddressId(
                        idx === selectedAddressId ? null : idx
                      )
                    }
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-xl border-2 p-3 text-sm transition-all duration-200',
                      selectedAddressId === idx
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'hover:bg-muted border-border/50'
                    )}
                  >
                    <div className="flex items-center gap-3 truncate pr-4">
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          selectedAddressId === idx
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="flex-1 truncate">
                        <p
                          className={cn(
                            'truncate text-sm font-bold',
                            selectedAddressId === idx ? 'text-primary' : ''
                          )}
                        >
                          {addrLabel}
                        </p>
                        {(a.complement || a.cep?.cep) && (
                          <p className="text-muted-foreground mt-1 text-xs font-medium">
                            {a.complement ? `Comp: ${a.complement} ` : ''}
                            {a.cep?.cep ? `CEP: ${maskCep(a.cep.cep)}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border/50 h-8 w-8 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteAddress(idx, e);
                          }}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Section 4: Questionnaire ---
export function QuestionnaireSection({
  questionnaire,
  setQuestionnaire,
  isLoading,
}: {
  questionnaire: QuestionnaireData;
  setQuestionnaire: (v: QuestionnaireData) => void;
  isLoading: boolean;
}) {
  return (
    <Card className="border-primary/10 flex h-full flex-col shadow-sm">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <CardTitle className="text-base font-semibold tracking-tight uppercase">
          Questionário Adicional
        </CardTitle>
        <CardDescription>
          Dados sobre comprovantes e situação penal.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-6 pt-6">
        <Field>
          <FieldLabel className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
            Comprovante de Residência *
          </FieldLabel>
          <RadioGroup
            value={questionnaire.proof_of_residence}
            onValueChange={(v) =>
              setQuestionnaire({ ...questionnaire, proof_of_residence: v })
            }
            disabled={isLoading}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              htmlFor="res-sim"
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-sm transition-all',
                questionnaire.proof_of_residence === 'Apresentou'
                  ? 'bg-primary/5 border-primary shadow-sm'
                  : 'hover:bg-muted border-border/50'
              )}
            >
              <RadioGroupItem value="Apresentou" id="res-sim" />
              <span
                className={cn(
                  'font-medium',
                  questionnaire.proof_of_residence === 'Apresentou'
                    ? 'text-primary'
                    : 'text-foreground'
                )}
              >
                Apresentou
              </span>
            </Label>
            <Label
              htmlFor="res-dec"
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-sm transition-all',
                questionnaire.proof_of_residence === 'Declarou'
                  ? 'bg-primary/5 border-primary shadow-sm'
                  : 'hover:bg-muted border-border/50'
              )}
            >
              <RadioGroupItem value="Declarou" id="res-dec" />
              <span
                className={cn(
                  'font-medium',
                  questionnaire.proof_of_residence === 'Declarou'
                    ? 'text-primary'
                    : 'text-foreground'
                )}
              >
                Declarou
              </span>
            </Label>
          </RadioGroup>
        </Field>

        <Field>
          <FieldLabel className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
            Vínculo Empregatício *
          </FieldLabel>
          <RadioGroup
            value={questionnaire.proof_of_employment}
            onValueChange={(v) =>
              setQuestionnaire({ ...questionnaire, proof_of_employment: v })
            }
            disabled={isLoading}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              htmlFor="emp-sim"
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-sm transition-all',
                questionnaire.proof_of_employment === 'Comprovou'
                  ? 'bg-primary/5 border-primary shadow-sm'
                  : 'hover:bg-muted border-border/50'
              )}
            >
              <RadioGroupItem value="Comprovou" id="emp-sim" />
              <span
                className={cn(
                  'font-medium',
                  questionnaire.proof_of_employment === 'Comprovou'
                    ? 'text-primary'
                    : 'text-foreground'
                )}
              >
                Comprovou
              </span>
            </Label>
            <Label
              htmlFor="emp-nao"
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-sm transition-all',
                questionnaire.proof_of_employment === 'Não possui'
                  ? 'bg-primary/5 border-primary shadow-sm'
                  : 'hover:bg-muted border-border/50'
              )}
            >
              <RadioGroupItem value="Não possui" id="emp-nao" />
              <span
                className={cn(
                  'font-medium',
                  questionnaire.proof_of_employment === 'Não possui'
                    ? 'text-primary'
                    : 'text-foreground'
                )}
              >
                Não possui
              </span>
            </Label>
          </RadioGroup>
        </Field>

        <Field>
          <FieldLabel className="text-muted-foreground mb-1.2 text-[10px] font-bold tracking-wider uppercase">
            Justificativa de Dispensa
          </FieldLabel>
          <Input
            placeholder="Ex: Doença, Viagem autorizada..."
            value={questionnaire.proof_of_legal_waiver}
            onChange={(e) =>
              setQuestionnaire({
                ...questionnaire,
                proof_of_legal_waiver: e.target.value,
              })
            }
            disabled={isLoading}
            className="bg-muted/30"
          />
        </Field>
      </CardContent>
    </Card>
  );
}
