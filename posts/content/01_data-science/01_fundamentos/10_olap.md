---
title: "OLAP"
trail: "Data Science"
line: "Fundamentos"
summary: "OLAP e a Filosofia dos Cubos de Dados"
---

## Estação 10
> OLAP e a Filosofia dos Cubos de Dados

## 1. O Conflito Entre a Operação e a Estratégia

Na Estação 09, nós salvamos o nosso sistema da sobrecarga usando o *Sharding*. Distribuímos o banco de dados em vários servidores para que o aplicativo do cliente nunca trave na hora de realizar uma compra ou registrar um clique.

Aquele sistema descentralizado e focado em velocidade extrema é chamado de **OLTP (Online Transaction Processing)**. Bancos OLTP são os "operários" do mundo dos dados. Eles são projetados para fazer milhões de tarefas minúsculas e ultrarrápidas: inserir a venda #405, atualizar o endereço do cliente #89, deletar o item #12 do carrinho.

Mas agora imagine que é a última sexta-feira do mês. O CEO da empresa entra na sua sala e faz a seguinte pergunta: *"Qual foi o nosso produto mais rentável na região Sul nos últimos 5 anos, comparado com o mesmo período na região Norte?"*

Se você tentar rodar essa consulta matemática massiva diretamente no banco de dados OLTP que está atendendo os clientes naquele momento, você vai sequestrar todo o processamento dos servidores. O site da empresa vai sair do ar, clientes não conseguirão comprar, e o caos se instaurará.

O banco de dados que atende o cliente **não pode** ser o mesmo banco de dados que atende o CEO. É aqui que a Ciência de Dados e a Engenharia de Software bifurcam, e nós entramos no domínio do **OLAP (Online Analytical Processing)**.

## 2. O Universo OLAP: Congelando o Tempo

OLAP é o oposto do OLTP. Enquanto o OLTP lida com o "agora" (Transações), o OLAP lida com o "passado" (Análise).

Para criar um ambiente OLAP, os Engenheiros de Dados fazem cópias periódicas dos dados de operação (geralmente de madrugada), limpam esses dados e os guardam em um gigantesco cofre centralizado chamado **Data Warehouse** (Armazém de Dados).

Nesse armazém, os dados não mudam mais. Um pedido feito em 2021 não sofrerá mais atualizações de endereço. Ele está historicamente congelado. Como os dados são estáticos, os Cientistas e Analistas de Dados podem executar cálculos matemáticos devastadores, agrupamentos complexos e testes de hipóteses na base inteira sem o menor risco de derrubar o aplicativo da empresa.

## 3. A Fuga da Segunda Dimensão: O Cubo de Dados

Até agora, pensamos em dados como tabelas bidimensionais (linhas e colunas). Mas tabelas 2D são péssimas para a mente humana analisar cruzamentos complexos.

O conceito central do OLAP é o **Cubo de Dados (Data Cube)**. Ele nos permite projetar a informação em múltiplas dimensões estruturadas. Pense em um cubo mágico onde cada eixo representa uma "Dimensão" de negócio:

- **Eixo X (O Quê):** Categoria de Produtos (Eletrônicos, Roupas, Livros).
- **Eixo Y (Onde):** Geografia (São Paulo, Nova York, Tóquio).
- **Eixo Z (Quando):** Tempo (Ano, Trimestre, Mês).

O valor que está dentro de um dos "quadradinhos" desse cubo é chamado de **Medida** (por exemplo: "Total de Faturamento" ou "Quantidade Vendida").

Quando você organiza os dados dessa forma, você destrava as quatro operações sagradas do OLAP:

1. **Roll-up (Resumir):** É o ato de "subir" o nível de abstração. Você está olhando para as vendas diárias e faz um *roll-up* para ver as vendas anuais. O cubo encolhe e os dados são somados.
2. **Drill-down (Aprofundar):** O oposto do Roll-up. Você está olhando as vendas do "Brasil" e clica para fazer um *drill-down*, expandindo a visão para revelar as vendas por "Estado" e depois por "Cidade".
3. **Slice (Fatiar):** Você corta o cubo como uma faca, isolando uma única dimensão. Ex: "Corte o cubo e me mostre apenas os dados do Ano de 2023". O seu cubo 3D vira uma tabela 2D novamente.
4. **Dice (Picar):** Você extrai um "sub-cubo" menor a partir do cubo maior. Ex: "Quero apenas Eletrônicos, apenas no Brasil, apenas no 1º Trimestre".

Essa flexibilidade dimensional é o que permite a criação de *Dashboards* interativos (como os do Power BI ou Tableau) onde o usuário clica e a tela se reconfigura instantaneamente.

## 4. Na Prática: Construindo e Fatiando um "Cubo" em Python

O `pandas` possui uma ferramenta maravilhosa para simular operações OLAP diretamente na memória: as Tabelas Dinâmicas (`pivot_table`). Ela permite pegar dados transacionais planos (estilo OLTP) e transformá-los em agregações multidimensionais num piscar de olhos.

Vamos simular o pedido do CEO e usar o Python para fazer operações de *Roll-up* e *Slice*.

Python

```
import pandas as pd
import numpy as np

# 1. Os Dados Transacionais (O que veio do sistema OLTP)
# Observe que é uma tabela plana, longa e repetitiva (Tidy Data)
dados_brutos = {
    'Data': ['2023-Q1', '2023-Q1', '2023-Q2', '2023-Q2', '2023-Q1', '2023-Q2'],
    'Regiao': ['Sul', 'Sul', 'Sul', 'Norte', 'Norte', 'Norte'],
    'Produto': ['Eletrônico', 'Roupa', 'Eletrônico', 'Roupa', 'Roupa', 'Eletrônico'],
    'Vendas': [50000, 15000, 60000, 20000, 12000, 45000]
}

df_vendas = pd.DataFrame(dados_brutos)
print("--- DADOS OPERACIONAIS (Formato Plano) ---")
print(df_vendas)
print("\n")

# 2. Operação OLAP: Criando o "Cubo" Analítico (Pivot Table)
# Vamos colocar a Região nas Linhas, o Produto nas Colunas e o Tempo como Sub-índice.
# A função 'sum' (soma) atua como a nossa regra de agregação.
cubo_olap = pd.pivot_table(
    df_vendas, 
    values='Vendas', 
    index=['Regiao', 'Data'],   # Nossas dimensões Y e Z
    columns=['Produto'],        # Nossa dimensão X
    aggfunc=np.sum,             # Matemática da agregação
    fill_value=0                # Preenche vazios com 0
)

print("--- VISÃO OLAP (Multi-dimensional) ---")
print(cubo_olap)
print("\n")

# 3. Operação de "Slice" (Fatiar o Cubo)
# O CEO quer focar APENAS na região Sul. Vamos fatiar nosso cubo.
fatia_sul = cubo_olap.loc['Sul']

print("--- OPERAÇÃO DE SLICE (Apenas Região Sul) ---")
print(fatia_sul)

# 4. Operação de "Roll-up" (Subir o nível / Somar tudo)
# Adicionando totais marginais para ver o panorama geral
rollup_total = pd.pivot_table(
    df_vendas, values='Vendas', index='Regiao', columns='Produto', 
    aggfunc=np.sum, fill_value=0, margins=True, margins_name='TOTAL GERAL'
)

print("\n--- OPERAÇÃO DE ROLL-UP (Totais Agregados) ---")
print(rollup_total)
```

Ao executar este código, você verá a tabela longa se transformar numa matriz de inteligência de negócios. É exatamente esse pré-processamento rápido que alimenta os gráficos que os executivos adoram analisar.

## Conexões para a Próxima Estação

O conceito de OLAP nos mostrou *o que* fazer com os dados para gerar estratégia: transformá-los em dimensões e medidas. Mas, do ponto de vista da arquitetura de software, como desenhamos as tabelas no banco de dados para que elas formem esse "cubo" de maneira eficiente?

Se no OLTP (Estação 03) nós usamos a Normalização para evitar repetições, no OLAP nós fazemos exatamente o oposto: nós abraçamos a redundância para ganhar velocidade de leitura.

Para entender essa mudança drástica de mentalidade, precisamos dominar a arte do **Star Schema** e do **Snowflake Schema**. Essa será a nossa próxima parada: **Estação 11 — Multidimensional Data Model**.