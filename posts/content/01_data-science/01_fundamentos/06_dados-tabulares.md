---
title: "Dados Tabulares"
trail: "Data Science"
line: "Fundamentos"
summary: "Dados Tabulares"
---

# Estação 06
## Dados Tabulares

| RESUMO            |                                |
| :---------------- | -----------------------------: |
| Palavras:         |                         ~1.400 |
| Tempo de leitura: |                          7 min |
| Linha             |                 01 Fundamentos |
| Progresso:        | `[■■■■----------------] 22.2%` |

### 1. O Triunfo da Simplicidade

Nós passamos pelas últimas estações discutindo bancos de dados complexos, partições de rede e álgebra relacional. Mas, no final do dia, quando um Cientista de Dados extrai a informação do servidor para começar a trabalhar no seu próprio computador, essa informação quase sempre assume uma única forma: **A Tabela**.

Dados Tabulares (_Tabular Data_) são a espinha dorsal da análise de dados e do Machine Learning clássico. Eles são o ponto de encontro perfeito entre a legibilidade humana (qualquer pessoa entende uma planilha) e o processamento de máquina.

Mas não se engane: jogar dados em linhas e colunas não significa que eles estão prontos para uso. Existe uma ciência exata na construção de uma tabela perfeita. Uma tabela mal estruturada pode inutilizar o algoritmo mais avançado de Inteligência Artificial do mundo.

### 2. A Anatomia Estrita de uma Tabela

Para que uma grade de números e textos seja considerada "Dado Tabular" pronto para análise, ela precisa obedecer a regras anatômicas rígidas. A comunidade de Ciência de Dados, liderada por estatísticos como Hadley Wickham, cunhou o termo **Tidy Data** (Dados Arrumados) para definir o formato tabular perfeito.

As três regras de ouro do Tidy Data são:

1. **Cada Variável deve ter sua própria coluna:** Uma variável é qualquer característica que você está medindo. (Ex: Idade, Preço, Cidade, Temperatura).
   
2. **Cada Observação deve ter sua própria linha:** Uma observação é a unidade completa sobre a qual você coletou os dados. (Ex: Um cliente específico, um imóvel à venda, uma transação financeira num dia exato).
   
3. **Cada Valor deve ter sua própria célula:** Não podemos ter uma célula com o texto "São Paulo / 25 Anos". Esses são dois valores distintos que pertencem a duas variáveis diferentes e devem estar em células separadas.
   

### 3. O Inimigo Silencioso: Tabelas de Apresentação vs. Tabelas de Dados

O maior choque para iniciantes é descobrir que a maioria das planilhas empresariais construídas no Excel **não são** Dados Tabulares no sentido científico.

Muitas empresas criam planilhas para serem bonitas para diretores lerem (com células mescladas, subtotais no meio das linhas, colunas de meses agrupadas sob um título de "Ano").

Veja o exemplo clássico do formato "Amplo" (_Wide Format_) contra o formato "Longo" (_Long Format_):

**A Tabela do Chefe (Wide Format - Ruim para ML):** Nesta tabela, os meses viraram colunas. Se o ano virar, você precisa adicionar mais colunas, quebrando a estrutura do seu banco de dados. 

| Produto | Jan/2023 | Fev/2023 | Mar/2023 |     |
| :------ | :------- | :------- | :------- | --- |
| Sapato  | 150      | 200      | 180      |     |
| Camisa  | 300      | 310      | 290      |     |


**A Tabela do Cientista de Dados (Long Format / Tidy Data):** Aqui, o "Mês" é reconhecido como o que ele realmente é: uma variável. E o "Volume de Vendas" é outra variável. 

| Produto | Mês_Ano  | Vendas |     |
| :------ | :------- | :----- | --- |
| Sapato  | Jan/2023 | 150    |     |
| Sapato  | Fev/2023 | 200    |     |
| Sapato  | Mar/2023 | 180    |     |
| Camisa  | Jan/2023 | 300    |     |

Essa estrutura longa é o combustível que os algoritmos de previsão de séries temporais exigem para conseguir "ler" o tempo.

### 4. Como os Dados Tabulares Vivem: CSV vs. Formatos Colunares

Quando exportamos nossos Dados Tabulares, precisamos escolher como o computador vai salvar isso no disco rígido.

O formato mais famoso e universal do mundo é o **CSV** (_Comma-Separated Values_). Ele é apenas um arquivo de texto puro, onde as colunas são separadas por vírgulas. `Sapato, Jan/2023, 150`

O CSV é maravilhoso porque é à prova de balas: qualquer sistema, desde um mainframe da década de 80 até o último modelo do ChatGPT, consegue abri-lo. No entanto, ele lê os dados **linha por linha**. Se você tiver um CSV com 50 milhões de linhas de clientes e 200 colunas, mas só quiser calcular a "Média de Idade", o computador será obrigado a carregar o arquivo inteiro na memória, o que causará um travamento.

É por isso que a Ciência de Dados moderna adotou formatos de **Armazenamento Colunar**, como o arquivo **Parquet**. Diferente do CSV, o Parquet salva os dados agrupados por coluna. Quando você pede a "Média de Idade", o computador vai diretamente no bloco do disco rígido onde moram apenas as idades, ignorando os nomes, endereços e históricos de compras. O que levaria minutos no CSV, acontece em milissegundos no formato colunar.

### 5. Na Prática: Limpando a Bagunça com Python

O processo de transformar uma tabela "suja" de escritório em um "Tidy Data" tabular é uma das habilidades mais valiosas do mercado. Vamos usar o Pandas para pegar aquela tabela ruim (Wide) e transformá-la na tabela perfeita (Long) usando uma função mágica chamada `melt` (derreter).

```python
import pandas as pd

# 1. Recebemos a "Tabela do Chefe" (Meses como colunas)
dados_ruins = {
    'Produto': ['Sapato', 'Camisa'],
    'Jan/2023': [150, 300],
    'Fev/2023': [200, 310],
    'Mar/2023': [180, 290]
}

df_wide = pd.DataFrame(dados_ruins)
print("--- TABELA ORIGINAL (WIDE FORMAT) ---")
print(df_wide)
print("\n")

# 2. O Cientista de Dados aplica a transformação Tidy Data (Melt)
# Vamos "derreter" as colunas de meses e transformá-las em linhas.
df_tidy = pd.melt(
    df_wide, 
    id_vars=['Produto'],          # A coluna que já está correta e atua como âncora
    var_name='Mes_Ano',           # O nome da nova variável que vai guardar os antigos nomes das colunas
    value_name='Vendas_Unidade'   # O nome da variável que vai guardar os números
)

print("--- TABELA PERFEITA (TIDY DATA / LONG FORMAT) ---")
# Ordenando apenas para ficar mais legível
df_tidy = df_tidy.sort_values(by=['Produto', 'Mes_Ano']).reset_index(drop=True)
print(df_tidy)
```

Ao executar este código, a matriz "quadrada" se transforma numa estrutura longa e analítica. É exatamente esse DataFrame formatado que alimentaremos nos modelos matemáticos.

### Conexões para a Próxima Estação

Agora sabemos como arrumar a casa. Temos uma grade bidimensional perfeita onde cada coluna é uma variável matemática e cada linha é um evento do mundo real.

Mas surge uma pergunta profunda: como sabemos se uma dessas colunas é realmente útil? Se tivermos uma coluna chamada "Status do Produto" e 100% das linhas disserem "Novo", essa coluna não nos diz absolutamente nada. Ela não tem "surpresa", não tem caos.

Na matemática da informação, chamamos essa medida do caos e da utilidade de uma variável de **Entropia**. Essa será a nossa próxima e fascinante parada: **Estação 07 — Entropy**.