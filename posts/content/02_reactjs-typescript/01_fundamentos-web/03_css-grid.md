---
title: "CSS Grid"
trail: "ReactJS + Typescript"
line: "Fundamentos Web"
summary: "Domine o CSS Grid e a arquitetura bidimensional. Aprenda a desenhar layouts responsivos e dashboards complexos usando grid-template-areas."
---

## Estação 03
### CSS Grid e a Arquitetura Bidimensional

---

|RESUMO| |
|:---|---:|
|Palavras:| ~1.300| 
|Tempo de leitura:| 6 min|
| Linha | 01 Fundamentos |
|Progresso:|`[■■■-----------------] 17%`|

Na estação anterior, você conheceu o Flexbox e descobriu como ele resolveu os maiores traumas do alinhamento web. Se o Flexbox é tão poderoso, por que precisamos de outra ferramenta de layout? A resposta está na dimensionalidade.

O Flexbox é um mestre **unidimensional**. Ele foi projetado para distribuir elementos em uma única direção por vez: ou em uma linha (horizontal), ou em uma coluna (vertical). Se você precisar controlar linhas e colunas *ao mesmo tempo* — criando uma malha complexa onde os elementos se alinham perfeitamente em ambos os eixos —, o Flexbox começa a exigir contêineres aninhados intermináveis.

Para a macroarquitetura da sua aplicação, nós usamos o **CSS Grid**. Ele é o primeiro e único sistema de layout nativo do CSS criado especificamente para trabalhar com **duas dimensões** simultaneamente.

#### A Regra de Ouro: Grid vs. Flexbox

A dúvida número um de todo desenvolvedor iniciante é: *"Quando uso Flexbox e quando uso Grid?"*. A comunidade adotou uma máxima prática que funciona em 95% dos casos:

> **Use CSS Grid para o layout da página (macro). Use Flexbox para o layout dos componentes (micro).**

Imagine um **Dashboard de Telemetria**.

- A divisão da tela em Barra Lateral (Sidebar), Cabeçalho (Header) e Área de Conteúdo (Main)? **Isso é trabalho para o Grid.** Ele define as "zonas" da tela.
- Dentro do Cabeçalho, você quer alinhar o título à esquerda e a foto do perfil à direita? **Isso é trabalho para o Flexbox.**

Eles não são inimigos; são ferramentas complementares. Você construirá a prateleira com o Grid e organizará os livros dentro dela com o Flexbox.

#### Os Fundamentos do Grid

Assim como no Flexbox, tudo começa ativando o comportamento no elemento contêiner (o "pai" dos elementos):

```css
.container {
  display: grid;
}
```

Apenas declarar `display: grid` não muda muita coisa visualmente. O verdadeiro poder é destravado quando você começa a desenhar a sua malha usando `grid-template-columns` (para definir as colunas) e `grid-template-rows` (para definir as linhas).

##### A Magia da Fração (`fr`)

No mundo do Grid, ganhamos uma nova unidade de medida exclusiva: o `fr` (Fração). Ele calcula o espaço livre disponível e o divide proporcionalmente. Esqueça ter que calcular porcentagens quebradas como `33.3333%`!

```css
.grid-basico {
  display: grid;
  /* Cria 3 colunas de tamanhos iguais, cada uma ocupa 1 fração do espaço */
  grid-template-columns: 1fr 1fr 1fr; 
  gap: 20px;
}
```

Se você quisesse que a coluna do meio fosse o dobro das outras, bastaria usar: `grid-template-columns: 1fr 2fr 1fr`. O navegador soma as frações (1+2+1 = 4) e distribui o espaço matematicamente sem quebrar o seu layout se você adicionar margens ou gaps.

#### O Padrão Ouro do Layout Declarativo: `grid-template-areas`

Existem várias formas de posicionar elementos no Grid, mas nenhuma é tão legível, expressiva e impressionante quanto o `grid-template-areas`. Essa propriedade permite que você "desenhe" o seu layout diretamente no CSS usando o que chamamos de *ASCII art* (arte com texto).

Vamos construir a estrutura de um painel administrativo (como o seu futuro projeto iMov). Nossa tela terá:

1. Uma **Sidebar** fixa na esquerda.
2. Um **Header** no topo (ao lado da sidebar).
3. O **Conteúdo Principal** no meio.
4. Um painel de **Widgets/Alertas** na direita.

**O HTML (Limpíssimo):**

```html
<div class="dashboard-layout">
  <aside class="sidebar">Navegação Principal</aside>
  <header class="header">Bem-vindo, Operador</header>
  <main class="content">Mapa e Gráficos de Telemetria</main>
  <aside class="widgets">Alertas do Sistema</aside>
</div>
```

**O CSS (A Mágica Bidimensional):**

```css
.dashboard-layout {
  display: grid;
  height: 100vh; /* Ocupa 100% da altura da tela */
  
  /* Definimos 3 colunas: 
     250px fixos para a sidebar,
     1fr para o conteúdo dinâmico (ocupa o resto),
     300px fixos para os widgets */
  grid-template-columns: 250px 1fr 300px;
  
  /* Definimos 2 linhas:
     80px para o cabeçalho,
     1fr para o resto da tela */
  grid-template-rows: 80px 1fr;

  /* O pulo do gato: desenhamos as áreas! */
  grid-template-areas:
    "sidebar header header"
    "sidebar content widgets";
}

/* Agora, apenas "nomeamos" cada elemento para encaixar no desenho acima */
.sidebar { grid-area: sidebar; }
.header  { grid-area: header;  }
.content { grid-area: content; }
.widgets { grid-area: widgets; }
```

Pare por um segundo e leia a propriedade `grid-template-areas`. Você consegue **ver** o layout apenas olhando para o código CSS. A `sidebar` ocupa a primeira coluna da primeira linha e desce até a segunda linha. O `header` se estende pelas colunas 2 e 3 na primeira linha.

Isso não é apenas código elegante; é um código que qualquer desenvolvedor (ou até um designer) entende no momento em que abre o arquivo.

#### Responsividade: O Superpoder do Grid

No passado, mudar o layout radicalmente do desktop para o mobile exigia escrever dezenas de linhas de CSS manipulando larguras, floats e margens. Com o `grid-template-areas`, adaptar esse dashboard para um smartphone é quase covardia de tão simples.

Usando uma *Media Query* (que avisa o CSS que a tela diminuiu), nós simplesmente reescrevemos o "desenho" da malha:

```css
/* Quando a tela for menor que 768px (Tablets e Celulares) */
@media (max-width: 768px) {
  .dashboard-layout {
    /* Passa a ter apenas 1 coluna e 4 linhas */
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    
    grid-template-areas:
      "header"
      "content"
      "widgets"
      "sidebar"; /* Movemos a sidebar para o final no mobile! */
  }
}
```

Com quatro linhas de código, nós transformamos um dashboard horizontal complexo em uma estrutura verticalizada perfeita para a leitura em celulares. Os elementos no HTML não mudaram de lugar, apenas a malha que os envolve foi reconfigurada.

#### O Piloto Automático: `auto-fit` e `minmax`

O Grid possui um truque final que o torna imbatível para listagens de itens (como uma galeria de fotos ou um catálogo de vagões de trem). Você pode criar layouts totalmente responsivos **sem usar uma única Media Query**, graças às funções `repeat()`, `auto-fit` e `minmax()`.

```css
.grid-de-cards {
  display: grid;
  gap: 16px;
  /* Tradução: "Crie quantas colunas couberem (auto-fit). 
     Elas devem ter no mínimo 250px e no máximo 1 fração (1fr)." */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

O resultado? Em um monitor ultrawide, você verá 5 cards por linha. Num notebook, 3 cards. Num celular, o grid entenderá que não cabem 250px lado a lado e fará o *wrap* para 1 card por linha. Tudo de forma automática e fluida.

#### Conclusão e Próximos Passos

O CSS Grid não substitui o Flexbox, ele o eleva. Aprender a dominar `fr`, `gap` e `grid-template-areas` dará a você a confiança para arquitetar qualquer interface desenhada no Figma ou CorelDraw, por mais excêntrica que ela seja, garantindo que o código se mantenha previsível e sustentável.

Com as Estações 1, 2 e 3 concluídas, você dominou a "Sintaxe Visual" da web. O nosso layout está montado, mas ele ainda é inerte e estático. A interface precisa de lógica, interatividade e inteligência.

A partir da **Estação 4**, começaremos a adicionar os "motores" à nossa aplicação, entrando no universo do **JavaScript ES6+**. Vamos desbravar escopos, arrow functions e a manipulação de dados que preparam o terreno definitivo para a chegada do React.