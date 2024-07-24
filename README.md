# Time Calculator

Questo script Node.js permette di analizzare i file markdown di report settimanali e calcolare le ore lavorate, raggruppate per Type e Client.

Nasce dalla mia esigenza di velocizzare e migliorare la gestione delle attività che faccio.

Il flow da collegare a questo tool è stato pensato utilizzando Trello, in una bacheca personale, può essere adattato a bacheche con piuù utenti e dividere il tutto per assegnatario del task anche se per il momento non è mio interesse implementare questa feature.

Allinterno della bacheca Trello ho una template di task come il seguente:

```text
{DESCRIPTION}
---
Client: {NAME}
Time: {HOURS}
Type: {CALL-ALTRO-FORMAZIONE-MANAGEMENT-STRATEGY}
```

Ogni task viene creato da questo template e i campi sotto i `---` vengono compilati manualmente.

Grazie a delle automazioni di trello crei i campi `Start` e `End` quando un task viene messo in determinate liste, in modo da poter tracciare il tempo in automatico e poi raffinarlo se serve solo manualmente con il campo `Time`.

Grazie all'estenzione [Trello Export](https://chromewebstore.google.com/detail/trelloexport/kmmnaeamjfdnbhljpedgfchjbkbomahp) su google chrome posso esportare la mia bacheca in formato `.md` e metterla in pasto a questo tool per avere un calcolo automatico delle varie attività.

È comunque possibile adattare questo flow a qualunque tool di management o creare i file manualmente come descritto sotto, quindi l'utente finale ha massima flessibilità sull'import dati.

Ogni fine settimana procedo con l'export della bachehca, inserisco il file all'interno di questo tool e vado ad archiavare i task che sono nella lista `Done`.

A fine mese vado ad eseguire il comando con le settimane che mi interessano e raccolgo l'output.

## Serve davvero questo tool?

Non so quanto sarà lunga la vita del tool ma calcoli alla mano mi farà sicuramente risparmiare tempo e nervoro. Attualmente per calcolare le ore del mese, visto il mio calendario abbastanza intricato impiego 40 min circa, con un buon margine di errore visto che calcolo tutto manulamnete. Dividendo il calcolo per settimane e tracciando tutto tramite task stimo di impiegare 10 min massimo per il calcolo delle ore mensili.

Questo tool è stato scritto in 3 ore circa di tempo, il calcolo del tempo lavorato lo faccio manualmente da più di 2 anni o ngi mese, era proprio ora di cambiare qualcosa.

Sono circa 8 ore/anno per calcolare le ore lavorate, quindi conto di ripagare il tmepo speso per la creazione di questo tool nei prossimi 6 mesi.

Lati positivi da menzionare:

* Calcolare le ore mensili manualmente mi provoca un carico di stress e nervoso incredibile, mi pare proprio tempo sprecato
* Questo flusso mi obbliga ad essere preciso e più organizzato
* Se necessario posso ricavare il tempo speso per ogni task e fare retrospettive

## Nota Bene

È possibile collegare la bacheca a `Google Calendar` per andare a tracciare anche gli eventi a calendario, per ora io gestisco manualmente questa operazione creando un task che raggruppa le ore di call a fine giornata

Attualmente i file contano le settimane, questo vuol dire che bisognerà gestire alcuni casi ad hoc per poter gestire il fine mese che non termina o inizia esattamente di domenica o lunedì, in una prossima versione potrò magari inserire questa logica, anche se per ora non è per me prioritaria.

## Prerequisiti

Assicurati di avere Node.js installato sulla tua macchina.

## Installazione

Clona questo repository sul tuo computer.

Esegui il comando per installare le dipendenze necessarie:

```sh
npm install
```

## Esecuzione

Assicurarsi di aver creato nella root di progetto una cartella `weeks` e di inserire al suo interno i file necessari al funzionamento del tool.

Per eseguire lo script, utilizza il comando:

```sh
npm run start <week_numbers> [print-md]
```

Dove <week_numbers> sono i numeri delle settimane che vuoi analizzare. Ad esempio:

```sh
npm run start 01 02 03 04
```

## Opzione print-md

Aggiungi print-md alla fine del comando per ottenere l'output anche in formato Markdown:

```sh
npm run start 01 02 03 04 print-md
```

**NB:** è possibile eseguire il comando `npm run start:md` e passare come parametri solo il numero delle settimane per abilitare l'opzione `print-md` in automatico

## Formattazione dei file Markdown

I file markdown devono essere formattati come segue per essere funzionali allo script:

* I file devono essere salvati nella cartella `./weeks` con il nome `week_<week_number>.md` Ad esempio: week_01.md
* Ogni file deve contenere una sezione `## Done` seguita da una lista di task.
* Ogni task deve iniziare con `### <task_title>` e avere una sezione `---` con i dettagli.

Esempio di file markdown:

```text
## Done ✨

### Task 1
Descrizione del task 1
---
Type: Development
Client: Client A
Time: 5.5

### Task 2
Descrizione del task 2
---
Type: Meeting
Start: 2024-07-01T09:00:00Z
End: 2024-07-01T11:00:00Z

### Task 3
Descrizione del task 3
---
Client: Client B
Start: 2024-07-01T14:00:00Z
End: 2024-07-01T16:00:00Z
```

### Dettagli sui campi

* Type: Il tipo di attività svolta. Se presente, l'attività sarà raggruppata sotto questo tipo
* Client: Il cliente per cui è stata svolta l'attività. Sarà usato per il raggruppamento se Type è assente
* Time: Il tempo impiegato per il task, espresso in ore. Se Time è assente, verrà calcolato utilizzando i campi Start e End
* Start: La data e ora di inizio dell'attività (in formato ISO)
* End: La data e ora di fine dell'attività (in formato ISO)

## Output

Lo script produce due tabelle:

* Una tabella per i gruppi di tipo Type.
* Una tabella per i gruppi di tipo Client.

Esempio di output:

```text
ANALISI WEEK 01
┌───────────────────┬────────┐
│ Tipo              │  Ore   │
├───────────────────┼────────┤
│ Development       │  5.50  │
│ Meeting           │  2.00  │
│ Client A          │  2.00  │
│ Client B          │  5.50  │
│ Client C          │  2.00  │
└───────────────────┴────────┘

ANALISI WEEK 02
┌───────────────────┬────────┐
│ Tipo              │  Ore   │
├───────────────────┼────────┤
│ Development       │  1.00  │
│ Meeting           │  1.00  │
│ Client B          │  2.00  │
└───────────────────┴────────┘

ANALISI WEEKS 01, 02
┌───────────────────┬────────┐
│ Tipo              │  Ore   │
├───────────────────┼────────┤
│ Development       │  6.50  │
│ Meeting           │  3.00  │
│ Client A          │  2.00  │
│ Client B          │  7.50  │
│ Client C          │  2.00  │
└───────────────────┴────────┘

```

## Output in formato Markdown

Se l'opzione print-md è utilizzata, l'output totale sarà anche stampato in formato Markdown.

Esempio di output in formato Markdown:

```text
ANALISI WEEK 01
┌───────────────────┬────────┐
│ Tipo              │  Ore   │
├───────────────────┼────────┤
│ Development       │  5.50  │
│ Meeting           │  2.00  │
│ Client A          │  2.00  │
│ Client B          │  5.50  │
│ Client C          │  2.00  │
└───────────────────┴────────┘

ANALISI WEEK 02
┌───────────────────┬────────┐
│ Tipo              │  Ore   │
├───────────────────┼────────┤
│ Development       │  1.00  │
│ Meeting           │  1.00  │
│ Client B          │  2.00  │
└───────────────────┴────────┘

ANALISI WEEKS 01, 02
┌───────────────────┬────────┐
│ Tipo              │  Ore   │
├───────────────────┼────────┤
│ Development       │  6.50  │
│ Meeting           │  3.00  │
│ Client A          │  2.00  │
│ Client B          │  7.50  │
│ Client C          │  2.00  │
└───────────────────┴────────┘

# Analisi Settimane 25, 26

* Development: 6.50
* Meeting: 3.00
* Client A: 2.00
* Client B: 7.50
* Client C: 2.00
```
