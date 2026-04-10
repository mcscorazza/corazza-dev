---
title: "Algebra Relacional"
trail: "Data Science"
line: "Fundamentos"
summary: "Álgebra Relacional e Bancos de Dados"
---

## Estação 03
> Álgebra Relacional e Bancos de Dados

### 1. A Ilusão da Planilha Gigante e a Crise da Redundância

Até agora, pensamos nos dados como matrizes perfeitas ou tabelas organizadas. Quando começamos a aprender Ciência de Dados, é tentador imaginar que toda a informação do mundo cabe em uma única e gigantesca aba de planilha, onde cada linha é um evento e as colunas contêm tudo o que precisamos saber.

No mundo real dos negócios, armazenar dados assim é um desastre de engenharia.

Imagine um e-commerce. Se você registrar cada venda em uma única tabela contendo `[ID do Pedido, Data, Nome do Cliente, Endereço do Cliente, Telefone do Cliente, Produto, Preço]`, o que acontece quando um cliente fiel, que já fez 50 compras, decide mudar de endereço?

O seu sistema teria que varrer 50 linhas do passado e atualizar o endereço em todas elas. Se o sistema falhar na linha 49, você acaba de criar uma **Anomalia de Atualização**. O banco de dados agora diz que o cliente mora em dois lugares diferentes. A confiança nos dados foi destruída.

Para salvar o mundo corporativo desse caos, em 1970, um matemático da IBM chamado Edgar F. Codd propôs uma solução revolucionária: **O Modelo Relacional**.

### 2. A Filosofia da Normalização: Dividir para Proteger

Em vez de uma tabela gigante e redundante, Codd provou matematicamente que os dados devem ser fragmentados em "temas" independentes.

- Clientes moram na tabela de `Clientes`.
  
- Produtos moram na tabela de `Produtos`.
  
- Pedidos moram na tabela de `Pedidos`.
  

Para que essa fragmentação funcione, cada entidade precisa de um identificador único, uma espécie de CPF ou DNA irrefutável. Em Bancos de Dados, chamamos isso de **Primary Key (Chave Primária)**.

Quando a tabela de `Pedidos` quer registrar quem comprou, ela não copia o nome e o endereço; ela apenas anota o ID numérico do cliente. Esse ID salvo em outra tabela atua como uma âncora e recebe o nome de **Foreign Key (Chave Estrangeira)**.

É assim que evitamos redundâncias. Se o cliente mudar de endereço, atualizamos apenas uma única célula na tabela `Clientes`. Todos os milhões de pedidos linkados a ele passam a apontar automaticamente para o endereço novo.

### 3. Álgebra Relacional: A Matemática por Trás do SQL

Se dividimos os dados em dezenas de tabelas para armazenamento seguro, como fazemos para juntá-los novamente e extrair insights? A resposta é a **Álgebra Relacional**.

A linguagem **SQL** (Structured Query Language), que é o pão e a água de qualquer Analista ou Cientista de Dados, nada mais é do que uma roupagem amigável (escrita em inglês) para as operações matemáticas da Álgebra Relacional.

Aqui estão as três operações mais fundamentais que você fará todos os dias na sua carreira:

#### A. Seleção (Operador Sigma: $\sigma$)

A Seleção atua nas **linhas** (horizontalmente). É o ato de filtrar a tabela para manter apenas os registros que satisfazem uma condição lógica.

- **Na Matemática:** $\sigma_{\text{idade} > 30} (\text{Clientes})$
  
- **No SQL:** `SELECT * FROM Clientes WHERE idade > 30`
  
- **Intuição:** "Desta tabela, separe apenas as pessoas com mais de 30 anos."
  

#### B. Projeção (Operador Pi: $\pi$)

A Projeção atua nas **colunas** (verticalmente). Em Big Data, uma tabela pode ter 500 colunas (como dados demográficos inteiros de um censo). Se você só quer calcular a média salarial, carregar 500 colunas na memória vai travar o seu computador. A projeção fatia a tabela.

- **Na Matemática:** $\pi_{\text{nome, salario}} (\text{Clientes})$
  
- **No SQL:** `SELECT nome, salario FROM Clientes`
  
- **Intuição:** "Ignore o resto, traga-me apenas os nomes e os salários."
  

#### C. Produto Cartesiano (Operador Cruz: $\times$)

Esta é a operação mais perigosa e computacionalmente cara dos bancos de dados. Se você cruzar uma tabela de 1.000 clientes com uma tabela de 1.000 produtos usando o Produto Cartesiano, o algoritmo combinará absolutamente cada cliente com cada produto existente, gerando uma tabela massiva e sem sentido de 1 milhão de linhas. É a base matemática para juntar dados, mas raramente o usamos puro na prática. Precisamos de lógica de interseção (os famosos _Joins_, que dominaremos na próxima estação).

### 4. Na Prática: Álgebra Relacional com Python (Pandas)

Para um Cientista de Dados, bancos de dados são onde a informação "mora", mas o Python é onde a informação "trabalha". Frequentemente, extraímos tabelas brutas do SQL e aplicamos as regras da Álgebra Relacional diretamente na memória RAM usando a biblioteca `pandas`.

Vamos simular o cenário de um e-commerce. Criaremos duas tabelas fragmentadas (DataFrames) e usaremos comandos de Seleção e Projeção para extrair o que precisamos.



```Python
import pandas as pd

# 1. Criando as entidades separadas (Simulando o Banco de Dados)
dados_clientes = {
    'cliente_id': [1, 2, 3], # Primary Key
    'nome': ['Ana', 'Bruno', 'Carlos'],
    'cidade': ['São Paulo', 'Rio de Janeiro', 'São Paulo'],
    'idade': [28, 35, 42]
}

dados_pedidos = {
    'pedido_id': [101, 102, 103, 104],
    'cliente_id': [1, 1, 3, 2], # Foreign Key (Conecta ao Cliente)
    'valor_compra': [150.00, 20.00, 999.00, 45.50]
}

# Transformando em DataFrames (Tabelas)
tabela_clientes = pd.DataFrame(dados_clientes)
tabela_pedidos = pd.DataFrame(dados_pedidos)

# ---------------------------------------------------------
# OPERAÇÃO 1: Projeção (Pi) - Selecionando apenas Colunas
# ---------------------------------------------------------
print("--- PROJEÇÃO ---")
# Extraindo apenas as colunas 'nome' e 'cidade'
projecao_clientes = tabela_clientes[['nome', 'cidade']]
print(projecao_clientes, "\n")

# ---------------------------------------------------------
# OPERAÇÃO 2: Seleção (Sigma) - Filtrando Linhas
# ---------------------------------------------------------
print("--- SELEÇÃO ---")
# Encontrando apenas clientes que moram em São Paulo
selecao_sp = tabela_clientes[tabela_clientes['cidade'] == 'São Paulo']
print(selecao_sp, "\n")

# ---------------------------------------------------------
# OPERAÇÃO 3: Junção (Join) - O encontro das chaves
# ---------------------------------------------------------
print("--- RECONSTRUINDO A INFORMAÇÃO (Merge) ---")
# Juntando quem comprou o quê, cruzando a Primary Key com a Foreign Key
relatorio_final = pd.merge(tabela_clientes, tabela_pedidos, on='cliente_id')

# Aplicando uma Projeção final para exibir um relatório limpo
relatorio_limpo = relatorio_final[['nome', 'cidade', 'valor_compra']]
print(relatorio_limpo)
```

Ao executar este código, você verá como a informação descentralizada volta a fazer sentido humano. O Python cruza o ID do cliente com o ID do pedido e revela que a Ana (de São Paulo) gastou 150.00 numa compra e 20.00 em outra.

### Conexões para a Próxima Estação

A Álgebra Relacional nos deu as ferramentas para quebrar e juntar tabelas. Mas o ato de "juntar" tabelas (o `pd.merge` que vimos no código) é uma arte complexa. O que acontece se um cliente se cadastrou, mas nunca comprou nada? Ele deve aparecer no relatório ou ser excluído? E se tivermos um pedido sem cliente associado (um erro de sistema)?

Para responder a isso com precisão cirúrgica, precisamos dominar a Teoria dos Conjuntos aplicada a dados. É o que veremos na nossa próxima parada: **Estação 04 — Inner, Outer, Cross e Theta Join.**