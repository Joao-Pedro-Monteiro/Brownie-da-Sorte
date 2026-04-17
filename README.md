# Brownie-da-Sorte

## 1. Visao geral

Este projeto e uma aplicacao front-end simples, inteiramente baseada em HTML, CSS e JavaScript puro, para sortear premios em uma roleta visual.

O sistema foi desenhado para funcionar sem backend. Toda a persistencia acontece no `localStorage` do navegador, e toda a comunicacao entre os arquivos acontece no cliente, principalmente por:

- carregamento de arquivos via `<script>`
- leitura e escrita no DOM
- funcoes exportadas no objeto global `window`
- persistencia via `localStorage`

Hoje o fluxo principal e:

1. a pagina carrega
2. `prize.js` restaura ou cria o estado da tabela de premios
3. `script.js` abre o popup de login
4. o usuario informa o nome
5. a roleta pode ser girada
6. o premio atual e lido da lista persistida
7. o giro e animado
8. o resultado e mostrado em popup
9. o nome do usuario e mantido como ultimo usuario ativo
10. o nome entra no historico de usuarios
11. o sorteio entra no historico de premios

---

## 2. Objetivo tecnico do sistema

O projeto resolve tres necessidades principais:

- oferecer uma interface simples de sorteio com forte apelo visual
- controlar a ordem dos premios por uma lista predefinida, em vez de depender apenas de sorte totalmente aleatoria a cada clique
- manter historico local de participantes e premios sorteados

Essa decisao de usar listas predefinidas permite controlar distribuicao de premios ao longo do tempo, inclusive o premio de maior valor.

---

## 3. Estrutura completa do repositorio

| Caminho | Tipo | Uso atual | Funcao |
| --- | --- | --- | --- |
| `index.html` | HTML | Usado | Estrutura da pagina, carrega CSS e scripts, define a roleta e os popups. |
| `style/style.css` | CSS | Usado | Estilo visual da tela, da roleta, do overlay e dos popups. |
| `js/prize.js` | JavaScript | Usado | Controla catalogo de premios, estado persistido da lista e historicos no `localStorage`. |
| `js/script.js` | JavaScript | Usado | Controla audio, animacao da roleta, login, exibicao de resultado e interacao com o DOM. |
| `images/seta.svg` | Asset SVG | Usado | Ponteiro fixo que indica o setor vencedor. |
| `images/Roleta.svg` | Asset SVG | Usado | Arte principal da roleta que gira na tela. |
| `images/backgorund.png` | Asset PNG | Nao referenciado no codigo atual | Possivel imagem de fundo original; o nome tem typo em `backgorund`. |
| `js/music/Talk Show Tonight  Music for content creator.mp3` | Audio MP3 | Usado | Musica de fundo. |
| `js/music/Spinning Wheel Sound Effect.mp3` | Audio MP3 | Usado | Som do giro da roleta. |
| `js/music/Win.mp3` | Audio MP3 | Usado | Som de vitoria ao mostrar o premio. |
| `README.md` | Markdown | Usado | Documentacao tecnica do projeto. |

Observacao importante:

- `style/style.css` nao usa `images/backgorund.png` diretamente. Em vez disso, embute uma imagem inteira em Base64 dentro do proprio CSS.

---

## 4. Arquitetura da aplicacao

### 4.1 Camada de markup

`index.html` define:

- o container geral da pagina
- a roleta clicavel
- o ponteiro
- o overlay escuro
- o popup de login
- o popup de resultado

### 4.2 Camada de apresentacao

`style/style.css` define:

- reset basico de layout
- fonte padrao
- painel principal com fundo embutido
- tamanho e posicionamento da roleta
- aparencia do overlay
- aparencia dos popups
- aparencia do campo de nome e dos botoes

### 4.3 Camada de dominio de premios

`js/prize.js` define:

- catalogo de listas de premios
- mapa semantico dos premios
- estado atual da lista em uso
- leitura e gravacao no `localStorage`
- historico de usuarios
- historico de sorteios

### 4.4 Camada de interacao e experiencia

`js/script.js` define:

- audios
- animacao de giro
- protecao contra clique duplicado durante o giro
- verificacao de usuario ativo
- exibicao do popup de resultado
- abertura obrigatoria do popup de login no carregamento

---

## 5. Como os arquivos se comunicam

### 5.1 Ordem de carregamento

No `index.html`, a ordem e:

1. CSS
2. `js/prize.js`
3. `js/script.js`

Isso importa porque `script.js` depende de itens expostos por `prize.js`, por exemplo:

- `STORAGE_KEYS`
- `controller()`
- `getCurrentPrizeEntry()`
- `addUserToHistory()`
- `addSpinToHistory()`

### 5.2 Comunicacao entre `prize.js` e `script.js`

`prize.js` exporta funcoes no `window`:

- `window.controller`
- `window.getCurrentPrizeEntry`
- `window.setList`
- `window.restorePrizeState`
- `window.clearPrizeState`
- `window.STORAGE_KEYS`
- `window.readStorageArray`
- `window.addUserToHistory`
- `window.addSpinToHistory`

`script.js` consome esses itens diretamente como globais do navegador.

### 5.3 Comunicacao entre JavaScript e HTML

O HTML chama funcoes globais via `onclick`:

- `spinWheel()`
- `usernameRegistration()`
- `backgroundMusic('play')`

O JavaScript acessa o DOM por `document.getElementById(...)` para:

- alterar visibilidade dos popups
- preencher nome do usuario
- preencher nome do premio
- aplicar rotacao da roleta

### 5.4 Comunicacao entre JavaScript e CSS

O JavaScript altera:

- `classList.add("show")` e `classList.remove("show")` em `#overlay`
- `style.display` de `#loginPopup` e `#resultPopup`
- `style.transform` de `#wheel`
- `style.transition` de `#wheel`

Ou seja, o CSS define a aparencia e o JavaScript define quando cada estado visual entra em cena.

---

## 6. Fluxo completo de execucao

### 6.1 Carregamento inicial da pagina

1. O navegador processa `index.html`.
2. O CSS e carregado.
3. `prize.js` e carregado e registra suas funcoes globais.
4. `script.js` e carregado e registra funcoes globais e listeners.
5. Quando o DOM termina de carregar, `initializeApp()` e chamado por `DOMContentLoaded`.
6. `initializeApp()` chama `controller()`.
7. `controller()` chama `restorePrizeState()`.
8. `restorePrizeState()` tenta recuperar do `localStorage`:
   - lista atual
   - indice da lista
   - posicao atual dentro da lista
9. Se nao houver estado valido, uma nova lista e sorteada com `setList(true)`.
10. O popup de login e aberto obrigatoriamente.

### 6.2 Identificacao do usuario

1. O usuario digita o nome.
2. O botao "Boa Sorte!" chama `usernameRegistration()`.
3. `usernameRegistration()` valida se o nome nao esta vazio.
4. O nome e salvo em `brownie.username`.
5. O nome entra no historico `brownie.users`.
6. O popup de login e fechado.
7. A musica de fundo e iniciada pelo `onclick` inline do botao.

### 6.3 Giro da roleta

1. O usuario clica na imagem da roleta.
2. O HTML chama `spinWheel()`.
3. `spinWheel()` impede novo giro se `isSpinning` estiver `true`.
4. `spinWheel()` garante que existe um usuario ativo.
5. `spinWheel()` chama `getCurrentPrizeEntry()`.
6. `getCurrentPrizeEntry()` devolve o premio da posicao atual da lista persistida.
7. `spinWheel()` salva `username + premio` em `brownie.spinHistory`.
8. `calculateTotalRotation()` calcula quantos graus a roleta deve girar.
9. `applyWheelRotation()` aplica a transformacao CSS.
10. O som de giro toca.
11. Depois de 9300 ms, o som do giro para, o popup de resultado abre e o som de vitoria toca.

### 6.4 Encerramento do sorteio

1. O popup de resultado mostra o primeiro nome do usuario.
2. O popup mostra o label do premio.
3. O botao "Otimo!" recarrega a pagina com `document.location.reload()`.
4. Como a pagina recarrega, o popup de login volta a abrir.

---

## 7. Persistencia em `localStorage`

### 7.1 Chaves utilizadas

| Chave | Escrita por | Lida por | Conteudo |
| --- | --- | --- | --- |
| `brownie.listIndex` | `savePrizeState()` | `restorePrizeState()` | Indice da lista atualmente em uso dentro de `catalogo`. |
| `brownie.list` | `savePrizeState()` | `restorePrizeState()` | Lista completa de premios atualmente ativa. |
| `brownie.position` | `savePrizeState()` | `restorePrizeState()` | Posicao do proximo premio a ser entregue. |
| `brownie.username` | `usernameRegistration()` | `spinWheel()`, `showPrizeResult()`, `initializeApp()` | Ultimo usuario ativo informado no popup. |
| `brownie.users` | `addUserToHistory()` | `readStorageArray()` | Historico de identificacoes de usuarios. |
| `brownie.spinHistory` | `addSpinToHistory()` | `readStorageArray()` | Historico de sorteios realizados com usuario e premio. |

### 7.2 Estrutura de `brownie.users`

Exemplo:

```json
[
  {
    "username": "Maria",
    "registeredAt": "2026-04-15T18:32:10.000Z"
  }
]
```

### 7.3 Estrutura de `brownie.spinHistory`

Exemplo:

```json
[
  {
    "username": "Maria",
    "prizeCode": "C2L3",
    "prizeLabel": "Compre 2 Leve 3",
    "position": 12,
    "listIndex": 1,
    "createdAt": "2026-04-15T18:33:02.000Z"
  }
]
```

### 7.4 Estrutura de `brownie.list`

Exemplo resumido:

```json
["C2L3", "BROWNIE_GRATIS", "C2L3", "..."]
```

---

## 8. Regras de negocio dos premios

### 8.1 Catalogo

`catalogo` contem 4 listas predefinidas de premios.

Cada lista mistura:

- `C2L3`
- `BROWNIE_GRATIS`
- `100_REAIS`

A aplicacao nao escolhe um premio totalmente aleatorio a cada clique. Ela primeiro escolhe uma lista e depois percorre essa lista sequencialmente.

### 8.2 Beneficio dessa abordagem

Essa arquitetura permite:

- controlar melhor a distribuicao de premios
- manter uma previsibilidade estatistica por campanha
- evitar excesso de premio maior em sorteios curtos

### 8.3 Mapa semantico dos premios

`PRIZE_MAP` traduz codigo tecnico em informacao visual:

| Codigo | Label exibido | Angulos possiveis |
| --- | --- | --- |
| `C2L3` | `Compre 2 Leve 3` | `45`, `135`, `225`, `315` |
| `BROWNIE_GRATIS` | `1 Brownie Gratis` | `0`, `180`, `270` |
| `100_REAIS` | `R$100,00` | `90` |

Os angulos sao usados para alinhar o setor vencedor ao ponteiro fixo.

---

## 9. Documentacao detalhada de `index.html`

### 9.1 Papel do arquivo

`index.html` monta a estrutura minima da aplicacao. Ele nao contem logica de negocio real, mas concentra:

- o carregamento de dependencias
- a hierarquia dos elementos
- os gatilhos de clique inline

### 9.2 Mapa linha a linha

| Linha | Descricao |
| --- | --- |
| 1 | Declara o documento como HTML5. |
| 2 | Abre o documento e define idioma `pt-BR`. |
| 3 | Abre a secao `<head>`. |
| 4 | Define codificacao UTF-8. |
| 5 | Define viewport para mobile. Ha um detalhe tecnico: existe um ponto entre `1.0.` e `maximum-scale`, o que nao e o formato ideal. |
| 6 | Define o titulo da aba. |
| 7 | Carrega as fontes externas `Luckiest Guy` e `Nunito` do Google Fonts. |
| 8 | Carrega `style/style.css`. |
| 9 | Carrega `js/prize.js` com `defer`. |
| 10 | Carrega `js/script.js` com `defer`. |
| 11 | Fecha o `<head>`. |
| 12 | Abre o `<body>`. |
| 13 | Abre o wrapper geral da pagina. |
| 14 | Abre a secao visual da roleta. |
| 15 | Abre o container relativo da roleta. |
| 16 | Abre o bloco do ponteiro. |
| 17 | Renderiza a imagem do ponteiro `seta.svg`. |
| 18 | Fecha o bloco do ponteiro. |
| 19 | Renderiza a imagem da roleta e associa `onclick="spinWheel()"`. |
| 20 | Fecha o container da roleta. |
| 21 | Fecha a secao visual. |
| 22 | Fecha o wrapper principal. |
| 23 | Linha em branco para separacao visual. |
| 24 | Abre o overlay que cobre a tela e abriga os popups. |
| 25 | Abre o popup de resultado. |
| 26 | Titulo do popup de resultado; `#resultUsername` sera preenchido pelo JavaScript. |
| 27 | Texto fixo "Voce ganhou:" com estilo inline. |
| 28 | `#prizeText` recebe o nome do premio. |
| 29 | Botao de fechamento do resultado. Hoje ele recarrega a pagina e contem uma tentativa de remover a chave `LO`, que nao participa do sistema atual. |
| 30 | Fecha o popup de resultado. |
| 31 | Linha em branco para separacao visual. |
| 32 | Abre o popup de login. |
| 33 | Titulo do popup de login. |
| 34 | Campo de entrada do nome do usuario. |
| 35 | Botao de confirmacao; chama `usernameRegistration()` e `backgroundMusic('play')`. |
| 36 | Fecha o popup de login. |
| 37 | Fecha o overlay. |
| 38 | Fecha o `<body>`. |
| 39 | Fecha o documento HTML. |

### 9.3 Dependencias diretas do HTML

Este arquivo depende de:

- ids corretos para o JavaScript localizar elementos
- nomes corretos das funcoes globais expostas no `window`
- assets estarem nos caminhos definidos

Se qualquer `id` mudar, o JavaScript precisa ser atualizado junto.

---

## 10. Documentacao detalhada de `style/style.css`

### 10.1 Papel do arquivo

Este arquivo define toda a camada visual da aplicacao.

Ele controla:

- layout geral
- painel central
- dimensoes da roleta
- ponteiro
- overlay
- animacao de entrada do popup
- botoes

### 10.2 Mapa por linhas e blocos

| Linha(s) | Descricao |
| --- | --- |
| 1 a 9 | Reset global: remove margens e paddings padrao, define `box-sizing`, remove decoracoes e outlines. |
| 11 a 13 | Impede selecao de imagens com o mouse. |
| 15 a 22 | Configura o `body`: altura minima, fundo marrom, centralizacao horizontal e fonte principal. |
| 24 a 33 | Configura `.page-wrapper`: largura fixa de 420 px, altura total e fundo visual embutido em Base64. |
| 27 | Linha mais pesada do arquivo. Armazena uma imagem inteira inline como `data:image/png;base64,...`. Isso aumenta muito o tamanho do CSS. |
| 28 e 29 | Ajustam a renderizacao desse fundo embutido. |
| 30 a 32 | Fazem o wrapper funcionar como coluna flex centralizada. |
| 35 a 39 | Configuram a secao da roleta com espacamento superior e inferior. |
| 41 a 47 | Configuram o container relativo da roleta; isso permite posicionar o ponteiro acima da roleta. |
| 49 a 59 | Configuram a imagem da roleta: tamanho, `transition`, cursor clicavel e borda redonda. |
| 61 | Leve brilho no hover da roleta. |
| 63 a 72 | Posicionam o ponteiro de forma absoluta sobre a roleta. |
| 73 a 76 | Fazem a imagem interna do ponteiro ocupar toda a largura do container. |
| 78 | Comentario identificando a secao dos popups. |
| 79 a 87 | Definem o overlay escuro em tela cheia, inicialmente oculto. |
| 88 | Classe `.show` muda o overlay para `display: flex`. |
| 90 a 101 | Definem o cartao visual do popup: gradiente, borda dourada, sombra e largura responsiva. |
| 104 a 107 | Definem a animacao `popIn`. |
| 109 a 115 | Estilizam os titulos dos popups. |
| 117 a 123 | Estilizam o label grande do premio. |
| 125 a 130 | Estilizam o campo `#usernameInput`. |
| 132 a 143 | Estilizam os botoes verdes com borda dourada. |

### 10.3 Observacoes de manutencao sobre o CSS

- O CSS usa largura fixa de `420px` no wrapper e `340px` na roleta. Em telas menores pode exigir refinamento responsivo.
- O fundo inline em Base64 torna o arquivo pesado e mais dificil de manter.
- Existe um arquivo `images/backgorund.png`, mas o estilo atual nao o utiliza.

---

## 11. Documentacao detalhada de `js/prize.js`

### 11.1 Papel do arquivo

`js/prize.js` e o nucleo da logica de premios.

Ele responde por:

- definir o catalogo de premios
- controlar o estado sequencial da lista ativa
- persistir esse estado
- restaurar estado apos recarga
- registrar historico de usuarios
- registrar historico de sorteios
- expor API global para outros arquivos

### 11.2 Mapa por linhas e blocos

| Linha(s) | Descricao |
| --- | --- |
| 1 | Inicia a constante `catalogo`. |
| 2 a 13 | Define a primeira lista de distribuicao de premios. |
| 14 a 25 | Define a segunda lista de distribuicao de premios. |
| 26 a 37 | Define a terceira lista de distribuicao de premios. |
| 38 a 49 | Define a quarta lista de distribuicao de premios. |
| 50 | Fecha `catalogo`. |
| 52 a 59 | Define `STORAGE_KEYS`, padronizando todas as chaves usadas no `localStorage`. |
| 61 a 77 | Define `PRIZE_MAP`, que traduz codigo interno em label e angulos validos da roleta. |
| 79 a 81 | Declara o estado em memoria: `list`, `listIndex` e `position`. |
| 83 a 97 | `readStorageArray(key)`: le JSON do `localStorage` com fallback seguro para array vazio. |
| 99 a 101 | `saveStorageArray(key, value)`: salva arrays serializados em JSON. |
| 103 a 110 | `logPrizeState(message, extra)`: padroniza logs internos deste modulo. |
| 112 a 117 | `savePrizeState()`: grava `listIndex`, `list` e `position`. |
| 119 a 127 | `clearPrizeState()`: limpa o estado persistido e o estado em memoria. |
| 129 a 141 | `setList(forceNew)`: sorteia uma nova lista ou mantem a atual, dependendo do argumento. |
| 143 a 174 | `restorePrizeState()`: restaura o estado salvo ou sorteia nova lista se o estado estiver invalido. |
| 176 a 226 | `getCurrentPrizeEntry()`: devolve o premio atual, avanca a posicao e prepara nova lista quando a atual termina. |
| 228 a 236 | `controller()`: ponto de entrada do modulo para inicializacao geral. |
| 238 a 260 | `addUserToHistory(username)`: acrescenta o usuario no historico `brownie.users`. |
| 262 a 289 | `addSpinToHistory(username, prizeResult)`: acrescenta um registro no historico `brownie.spinHistory`. |
| 291 a 299 | Exporta a API publica do modulo para `window`. |

### 11.3 Explicacao detalhada das estruturas

#### `catalogo`

O `catalogo` e um array de arrays.

Cada array interno representa uma trilha de premios ja planejada.

Isso quer dizer:

- primeiro o sistema escolhe qual tabela vai usar
- depois ele entrega os premios daquela tabela em ordem

#### `STORAGE_KEYS`

Centraliza nomes das chaves de persistencia. Isso evita erro de digitacao espalhado pelo projeto.

#### `PRIZE_MAP`

Conecta tres camadas:

- codigo interno do premio
- texto amigavel mostrado ao usuario
- angulos visuais compatveis com o setor da roleta

### 11.4 Explicacao detalhada das funcoes

#### `readStorageArray(key)`

Responsabilidade:

- ler uma chave do `localStorage`
- tentar converter de JSON para array
- proteger a aplicacao contra JSON quebrado

Comportamento defensivo:

- se nao existir valor, retorna `[]`
- se houver erro de parse, registra no console e retorna `[]`

#### `saveStorageArray(key, value)`

Responsabilidade:

- serializar arrays em JSON
- centralizar a escrita de arrays

#### `savePrizeState()`

Responsabilidade:

- persistir o andamento da lista atual

Dados persistidos:

- qual lista foi escolhida
- qual e o conteudo da lista
- qual sera o proximo item entregue

#### `clearPrizeState()`

Responsabilidade:

- resetar o modulo para um estado limpo

Impacto:

- apaga apenas o controle da tabela de premios
- nao apaga `brownie.username`
- nao apaga `brownie.users`
- nao apaga `brownie.spinHistory`

#### `setList(forceNew = false)`

Responsabilidade:

- decidir se a lista atual continua
- ou se uma nova lista deve ser sorteada

Regras:

- se `forceNew` for `false` e ja houver lista em memoria, ela continua
- caso contrario, um novo `listIndex` e sorteado

#### `restorePrizeState()`

Responsabilidade:

- reidratar o modulo apos reload

Protecoes importantes:

- valida se `savedList` e um array
- valida se `position` nao ficou fora dos limites
- se algo estiver inconsistente, reconstroi o estado

#### `getCurrentPrizeEntry()`

Esta e a funcao mais importante do modulo.

Responsabilidade:

- garantir que existe lista valida
- garantir que a posicao e valida
- descobrir o codigo do premio atual
- buscar a configuracao do premio
- sortear um dos angulos validos daquele premio
- devolver um objeto pronto para a camada visual
- avancar a posicao para o proximo sorteio

Objeto retornado:

```json
{
  "code": "C2L3",
  "label": "Compre 2 Leve 3",
  "angle": 135,
  "position": 12,
  "listIndex": 1
}
```

#### `controller()`

Responsabilidade:

- servir como entrada publica de inicializacao
- devolver um resumo do estado atual

#### `addUserToHistory(username)`

Responsabilidade:

- registrar cada identificacao no popup

Observacao:

- ele nao faz deduplicacao
- se a mesma pessoa informar o nome 10 vezes, o historico tera 10 entradas

#### `addSpinToHistory(username, prizeResult)`

Responsabilidade:

- registrar quem girou
- qual premio recebeu
- em que posicao da lista isso ocorreu
- qual tabela estava em uso

Essa funcao transforma o `localStorage` em historico de campanha.

### 11.5 API publica exposta por `prize.js`

| Global | Finalidade |
| --- | --- |
| `controller` | Inicializa e devolve resumo do estado. |
| `getCurrentPrizeEntry` | Entrega o proximo premio e avanca a lista. |
| `setList` | Sorteia ou mantem lista. |
| `restorePrizeState` | Restaura estado persistido. |
| `clearPrizeState` | Limpa estado de controle dos premios. |
| `STORAGE_KEYS` | Compartilha nomes das chaves persistidas. |
| `readStorageArray` | Le arrays do `localStorage` com seguranca. |
| `addUserToHistory` | Registra usuarios no historico. |
| `addSpinToHistory` | Registra sorteios no historico. |

---

## 12. Documentacao detalhada de `js/script.js`

### 12.1 Papel do arquivo

`js/script.js` e a camada de experiencia do usuario.

Ele responde por:

- tocar audios
- girar a roleta
- abrir e fechar estados visuais
- validar se ha usuario informado
- mostrar resultado
- inicializar a aplicacao apos `DOMContentLoaded`

### 12.2 Mapa por linhas e blocos

| Linha(s) | Descricao |
| --- | --- |
| 1 a 3 | Criam tres objetos `Audio` apontando para os arquivos MP3. |
| 5 e 6 | Definem volume e loop da musica de fundo. |
| 8 e 9 | Definem volumes do som da roleta e da vitoria. |
| 11 a 15 | Declaram flags de estado para audio, rotacao e travamento de giro. |
| 17 a 19 | `logWheel(message, extra)`: padroniza logs deste modulo. |
| 21 a 42 | `backgroundMusic(action)`: toca, pausa ou reinicia a musica de fundo. |
| 44 a 66 | `wheelSound(action)`: controla o audio do giro. |
| 68 a 90 | `winSound(action)`: controla o audio de vitoria. |
| 92 a 99 | Listener de `dblclick`: alterna play/pause da musica de fundo. |
| 101 a 138 | `spinWheel()`: funcao principal do sorteio visual. |
| 140 a 158 | `calculateTotalRotation(prizeAngle)`: calcula os graus exatos do giro. |
| 160 a 166 | `applyWheelRotation(totalRotation)`: aplica CSS `transform` na roleta. |
| 168 a 188 | `showPrizeResult(prizeResult)`: preenche popup de resultado e exibe overlay. |
| 190 a 195 | `closeResult()`: fecha overlay, para som e reseta rotacao em memoria. |
| 197 a 212 | `usernameRegistration()`: valida nome, salva usuario e fecha popup de login. |
| 214 a 232 | `initializeApp()`: inicializa a interface e abre o popup de login. |
| 234 | Registra `initializeApp()` no `DOMContentLoaded`. |
| 236 a 241 | Exporta funcoes principais para `window`. |

### 12.3 Explicacao detalhada das variaveis

#### Objetos de audio

- `backgroundMusicMP3`: musica ambiente
- `wheelSoundMP3`: som do giro
- `winSoundMP3`: som de celebracao

#### Flags de estado

- `isBackgroundMusicPlaying`: evita perder nocao do estado da musica
- `isWheelSoundPlaying`: informa se o som do giro esta ativo
- `isWinSoundPlaying`: informa se o som de vitoria esta ativo
- `currentRotation`: guarda a rotacao acumulada da roleta
- `isSpinning`: impede cliques repetidos durante a animacao

### 12.4 Explicacao detalhada das funcoes

#### `backgroundMusic(action)`

Aceita:

- `play`
- `pause`
- `stop`

Pontos importantes:

- `stop` pausa e zera o `currentTime`
- o estado tambem e refletido na flag `isBackgroundMusicPlaying`

#### `wheelSound(action)` e `winSound(action)`

Seguem a mesma ideia do audio de fundo, mas sem loop configurado aqui.

#### Listener de `dblclick`

Responsabilidade:

- permitir alternar a musica de fundo por duplo clique na janela

Isso e um atalho operacional, util em eventos presenciais.

#### `spinWheel()`

Esta e a principal funcao visual do sistema.

Sequencia interna:

1. bloqueia tentativas simultaneas
2. garante que existe `brownie.username`
3. chama `getCurrentPrizeEntry()`
4. registra o sorteio com `addSpinToHistory(...)`
5. calcula a rotacao total
6. reduz o volume da musica de fundo, se estiver tocando
7. toca o som do giro
8. aplica a animacao
9. aguarda 9300 ms
10. mostra o resultado

#### `calculateTotalRotation(prizeAngle)`

Responsabilidade:

- calcular uma rotacao que:
  - pare no angulo correto
  - faca varias voltas extras
  - respeite a rotacao acumulada anterior

Passos matematicos:

- pega `currentRotation % 360`
- escolhe de 3 a 6 voltas completas
- calcula o angulo alvo
- soma tudo em `totalRotation`

#### `applyWheelRotation(totalRotation)`

Responsabilidade:

- aplicar a animacao visual diretamente no elemento `#wheel`

Ele atualiza:

- `style.transition`
- `style.transform`
- `currentRotation`

#### `showPrizeResult(prizeResult)`

Responsabilidade:

- extrair o primeiro nome do usuario
- preencher o popup
- tocar o som de vitoria
- esconder o login
- mostrar o resultado

#### `closeResult()`

Responsabilidade:

- remover overlay
- parar som de vitoria
- zerar rotacao acumulada

Observacao:

- a funcao existe, mas o HTML atual nao usa essa funcao no botao do popup de resultado

#### `usernameRegistration()`

Responsabilidade:

- validar nome
- salvar ultimo usuario ativo
- registrar esse usuario no historico
- fechar o popup

Observacao importante:

- esta funcao registra toda confirmacao de nome no historico
- ela nao impede repeticao do mesmo nome

#### `initializeApp()`

Responsabilidade:

- inicializar o estado vindo de `prize.js`
- garantir que o popup de resultado comece oculto
- abrir sempre o popup de login
- preencher o input com o ultimo usuario salvo, se houver

Esse comportamento foi alterado para obrigar identificacao a cada carregamento.

### 12.5 API publica exposta por `script.js`

| Global | Finalidade |
| --- | --- |
| `backgroundMusic` | Controle manual da musica de fundo. |
| `wheelSound` | Controle manual do som da roleta. |
| `winSound` | Controle manual do som de vitoria. |
| `spinWheel` | Dispara o sorteio visual. |
| `usernameRegistration` | Confirma nome do usuario. |
| `closeResult` | Fecha o popup de resultado. |

---

## 13. Assets visuais e sonoros

### 13.1 Assets usados diretamente

| Arquivo | Consumido por | Papel |
| --- | --- | --- |
| `images/seta.svg` | `index.html` | Ponteiro fixo sobre a roleta. |
| `images/Roleta.svg` | `index.html` | Disco principal que gira. |
| `js/music/Talk Show Tonight  Music for content creator.mp3` | `js/script.js` | Musica ambiente. |
| `js/music/Spinning Wheel Sound Effect.mp3` | `js/script.js` | Som de rotacao. |
| `js/music/Win.mp3` | `js/script.js` | Som de celebracao. |

### 13.2 Assets presentes mas nao referenciados

| Arquivo | Situacao |
| --- | --- |
| `images/backgorund.png` | Nao aparece no codigo atual. Alem disso, o nome parece conter typo. |

### 13.3 Observacoes sobre manutencao de assets

- `images/Roleta.svg` e muito grande em bytes; qualquer troca de arte pode impactar carregamento.
- O CSS embute uma imagem completa em Base64. Em manutencoes futuras, pode ser melhor externalizar esse fundo para um arquivo real.

---

## 14. Pontos de atencao para manutencao

### 14.1 Botao do resultado

Hoje o botao "Otimo!" em `index.html`:

- nao usa `closeResult()`
- recarrega a pagina
- tenta remover `localStorage.removeItem('LO')`, mas a chave `LO` nao faz parte do sistema documentado

Isso sugere resquicio de implementacao antiga.

### 14.2 Chamada inline no HTML

O projeto usa `onclick` inline.

Vantagem:

- simplicidade

Custo:

- maior acoplamento entre HTML e nomes globais do JavaScript

### 14.3 Dependencia de globais em `window`

`script.js` depende fortemente de `prize.js` ter sido carregado antes.

Se um dia o projeto migrar para modulos ES (`type="module"`), essa estrategia deve ser reescrita.

### 14.4 Fundo em Base64 no CSS

O CSS esta pesado por causa da imagem embutida.

Risco:

- manutencao mais dificil
- arquivo maior que o necessario
- diff de versionamento pouco legivel

### 14.5 Historicos sem limpeza automatica

`brownie.users` e `brownie.spinHistory` so crescem.

Para eventos longos, pode ser necessario:

- exportar
- paginar
- limpar
- limitar tamanho

---

## 15. Como fazer upgrades com seguranca

### 15.1 Adicionar novo premio

Passos:

1. adicionar o codigo do premio em `catalogo`
2. adicionar esse codigo em `PRIZE_MAP`
3. garantir que a arte da roleta tenha um setor correspondente
4. garantir que os angulos apontem corretamente para esse setor

### 15.2 Alterar a probabilidade dos premios

Como a logica e baseada em listas, a probabilidade nao e alterada por pesos numericos.

Ela e alterada por:

- quantidade de vezes que cada codigo aparece em cada lista
- quantidade de listas existentes

### 15.3 Exibir historico na interface

Melhor ponto de extensao:

- ler `brownie.spinHistory` com `readStorageArray(STORAGE_KEYS.spinHistory)`
- renderizar em novo popup, tabela ou painel administrativo

### 15.4 Migrar para backend

Se o projeto crescer, a ordem recomendada e:

1. mover historicos para API
2. manter `localStorage` apenas como cache de sessao
3. mover catalogo para configuracao central
4. remover dependencia de globais em `window`

### 15.5 Tornar a interface mais modular

Possiveis etapas:

1. substituir `onclick` inline por `addEventListener`
2. transformar `prize.js` e `script.js` em modulos ES
3. separar `audio`, `ui`, `storage` e `prize-engine` em arquivos distintos

---

## 16. Resumo funcional por arquivo

| Arquivo | Pergunta que ele responde |
| --- | --- |
| `index.html` | Quais elementos existem na tela? |
| `style/style.css` | Como esses elementos aparecem visualmente? |
| `js/prize.js` | Qual premio deve sair agora e como isso fica persistido? |
| `js/script.js` | Como o usuario interage com a roleta e como o resultado aparece? |

---

## 17. Checklist de manutencao futura

Antes de alterar o projeto, vale checar:

- se a mudanca exige alterar HTML, CSS e JS ao mesmo tempo
- se ids do DOM continuam iguais
- se as chaves de `localStorage` continuam compativeis
- se um novo premio tambem foi mapeado em `PRIZE_MAP`
- se os angulos da roleta continuam coerentes com a arte
- se o historico ainda faz sentido para a campanha
- se o popup final deve continuar recarregando a pagina

---

## 18. Estado atual documentado

No estado atual do repositorio:

- o popup de login abre sempre ao carregar a pagina
- o nome informado e salvo como usuario atual
- o nome entra no historico `brownie.users`
- cada giro entra no historico `brownie.spinHistory`
- a sequencia de premios sobrevive a recargas por `localStorage`
- a tela e totalmente client-side

Esse README foi escrito para servir como base de manutencao, onboarding e futuras refatoracoes.
