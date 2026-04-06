## Estação 01 — HTML Moderno e Semântico

### 1. Introdução

O desenvolvimento de aplicações modernas com ReactJS e TypeScript exige uma base sólida em conceitos fundamentais da web. Entre esses conceitos, o HTML (HyperText Markup Language) ocupa uma posição central, pois é responsável por definir a estrutura e o significado do conteúdo apresentado ao usuário.

Embora frameworks como React abstraiam parte da complexidade da manipulação do DOM, eles não eliminam a necessidade de compreender profundamente o HTML. Pelo contrário, ampliam sua importância, uma vez que decisões estruturais incorretas podem comprometer acessibilidade, desempenho e manutenibilidade da aplicação.

Nesta estação, o foco será o estudo do HTML moderno com ênfase em semântica, organização estrutural e boas práticas.



### 2. HTML como Linguagem de Estrutura

#### Definição de HTML

O HTML é uma linguagem de marcação utilizada para estruturar documentos na web. Diferentemente de linguagens de programação, ele não possui lógica de execução, mas sim um conjunto de elementos que descrevem o conteúdo.

Um exemplo simples:

```html
<h1>Meu Blog</h1>
<p>Bem-vindo ao meu site.</p>
```

Nesse caso:

- `<h1>` define um título principal
- `<p>` define um parágrafo

#### Separação de Responsabilidades

No desenvolvimento web moderno, há uma separação clara de responsabilidades:

- HTML → Estrutura e significado
- CSS → Estilo e apresentação
- JavaScript → Comportamento e lógica

Essa separação permite maior organização, reutilização e escalabilidade.



### 3. Estrutura de um Documento HTML

#### Estrutura Básica

Todo documento HTML segue uma estrutura padrão:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Meu Site</title>
</head>
<body>
  <h1>Olá, mundo!</h1>
</body>
</html>
```

#### Elementos Principais

##### Declaração DOCTYPE

```html
<!DOCTYPE html>
```

Indica ao navegador que o documento utiliza HTML5.

##### Elemento `<html>`

Elemento raiz que engloba todo o conteúdo da página.

##### Elemento `<head>`

Contém metadados, como:

- Codificação de caracteres
- Título da página
- Informações para SEO
- Links para arquivos externos

##### Elemento `<body>`

Contém todo o conteúdo visível ao usuário.



### 4. Semântica em HTML

#### Conceito de Semântica

Semântica refere-se ao uso de elementos HTML que descrevem corretamente o significado do conteúdo.

Considere os exemplos:

```html
<div class="titulo">Meu Blog</div>
<h1>Meu Blog</h1>
```

Embora visualmente semelhantes, apenas o segundo exemplo comunica corretamente que se trata de um título principal.

#### Importância da Semântica

O uso correto da semântica impacta diretamente:

- Acessibilidade
- SEO (Search Engine Optimization)
- Manutenção do código
- Interoperabilidade com ferramentas

Motores de busca como o Google utilizam a estrutura semântica para interpretar o conteúdo das páginas.



### 5. Elementos Semânticos Estruturais

#### Organização da Página

O HTML5 introduziu elementos que permitem estruturar melhor o conteúdo.

##### <header>

Representa o cabeçalho da página ou de uma seção.

#####  <nav>

Define uma área de navegação.

##### <main>

Contém o conteúdo principal da página.

##### <section>

Agrupa conteúdos relacionados.

##### <article>

Representa conteúdo independente, como um post de blog.

##### <aside>

Conteúdo complementar, como barras laterais.

##### <footer>

Rodapé da página ou seção.

#### Exemplo de Estrutura Completa

```html
<body>
  <header>
    <h1>Corazza.dev</h1>
  </header>

  <nav>
    <ul>
      <li>Home</li>
      <li>Blog</li>
    </ul>
  </nav>

  <main>
    <article>
      <h2>Título do post</h2>
      <p>Conteúdo do post...</p>
    </article>
  </main>

  <footer>
    <p>© 2026</p>
  </footer>
</body>
```



### 6. Elementos de Texto

#### Títulos

Os elementos `<h1>` até `<h6>` representam níveis hierárquicos de títulos.

Exemplo:

```html
<h1>Título principal</h1>
<h2>Subtítulo</h2>
<h3>Seção</h3>
```

##### Boas Práticas

- Utilizar apenas um `<h1>` por página
- Manter hierarquia lógica
- Não usar títulos apenas para estilização



#### Parágrafos e Ênfase

##### <p>

Define um parágrafo de texto.

##### <strong>

Indica importância.

##### <em>

Indica ênfase.



#### Elementos Genéricos

##### <div>

Elemento de bloco sem significado semântico.

##### <span>

Elemento inline genérico.

Esses elementos devem ser utilizados apenas quando não houver alternativa semântica adequada.



### 7. Listas

#### Tipos de Listas

##### Lista Não Ordenada

```html
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

##### Lista Ordenada

```html
<ol>
  <li>Primeiro</li>
  <li>Segundo</li>
</ol>
```



### 8. Links e Navegação

#### Elemento `<a>`

O elemento `<a>` (âncora) é utilizado para criar hyperlinks.

```html
<a href="/blog">Ir para o blog</a>
```

#### Importância

Os links são fundamentais para a navegação e para a estrutura da web como um todo.



### 9. Imagens

#### Elemento `<img>`

```html
<img src="imagem.jpg" alt="Descrição da imagem">
```

#### Atributo `alt`

O atributo `alt` é essencial para:

- Acessibilidade
- SEO
- Fallback em caso de erro



### 10. Acessibilidade

#### Conceito

Acessibilidade refere-se à capacidade de tornar o conteúdo utilizável por todos, incluindo pessoas com deficiência.

#### Boas Práticas

- Utilizar elementos semânticos corretos
- Garantir navegação via teclado
- Evitar uso indevido de elementos genéricos

Exemplo:

```html
<button>Menu</button>
```

É preferível a:

```html
<div>Menu</div>
```



### 11. HTML no Contexto do React

#### JSX

No React, o HTML é escrito através do JSX.

```jsx
function App() {
  return <h1>Olá, mundo!</h1>;
}
```

#### Importância do Conhecimento de HTML

O domínio de HTML permite:

- Criar componentes bem estruturados
- Melhorar acessibilidade
- Facilitar manutenção
- Evitar erros comuns



### 12. Boas Práticas Gerais

#### Uso Correto de Elementos

Escolher sempre o elemento mais adequado ao conteúdo.

#### Hierarquia de Conteúdo

Manter organização lógica entre títulos e seções.

#### Redução de Elementos Genéricos

Evitar uso excessivo de `<div>`.

#### Clareza e Organização

Escrever código limpo e legível.



### 13. Atividade Prática

#### Objetivo

Construir a estrutura HTML de uma página de blog.

#### Requisitos

- Cabeçalho com título do site
- Menu de navegação
- Área principal com múltiplos artigos
- Rodapé

#### Exemplo de Referência

```html
<header>
  <h1>Corazza.dev</h1>
</header>

<nav>
  <ul>
    <li>Home</li>
    <li>Blog</li>
  </ul>
</nav>

<main>
  <article>
    <h2>Post 1</h2>
    <p>Resumo...</p>
  </article>

  <article>
    <h2>Post 2</h2>
    <p>Resumo...</p>
  </article>
</main>

<footer>
  <p>© 2026 - Marcos Corazza</p>
</footer>
```



### 14. Síntese da Estação

Ao final desta estação, o estudante deve ser capaz de:

- Compreender o papel do HTML na web
- Utilizar corretamente elementos semânticos
- Estruturar páginas de forma organizada
- Aplicar boas práticas de acessibilidade
- Preparar a base para o uso de ReactJS



### 15. Preparação para a Próxima Estação

Com a estrutura bem definida, o próximo passo será trabalhar a apresentação visual utilizando CSS, com foco inicial em layout e organização com Flexbox.

