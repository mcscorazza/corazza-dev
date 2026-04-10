---
title: "Entropia"
trail: "Data Science"
line: "Fundamentos"
summary: "Entropia e Ganho de Informação"
---

## Estação 07
> Entropia e Ganho de Informação

## 1. O Paradoxo da Coluna Inútil

Na Estação 06, aprendemos a organizar nossos dados com perfeição geométrica. Construímos o _Tidy Data_: uma tabela linda onde cada coluna é uma variável e cada linha é uma observação.

Mas ter uma coluna perfeitamente formatada não significa que ela tenha **valor**.

Imagine que você está construindo um modelo de Inteligência Artificial para prever se um cliente vai cancelar a assinatura do seu serviço (o famoso _Churn_). A sua tabela tem 100 mil clientes e dezenas de colunas: Idade, Tempo de Assinatura, Número de Reclamações e... "Planeta de Residência".

Se você olhar para a coluna "Planeta de Residência", 100% das linhas estarão preenchidas com "Terra". O dado está limpo, está correto e está formatado. Mas ele é absolutamente inútil. Por quê? Porque **não há surpresa**. Se você já sabe a resposta antes mesmo de olhar para o dado, essa informação não te ajuda a separar os clientes que cancelam dos que ficam.

Para o algoritmo de Machine Learning, nós precisamos de uma forma matemática de olhar para uma coluna e perguntar: _"Quanta incerteza, quanta bagunça e quanta surpresa existe aqui?"_ A resposta para isso é o conceito mais profundo da Teoria da Informação: a **Entropia**.

## 2. A Física Encontra os Dados: O Que é Entropia?

O termo "Entropia" nasceu na Termodinâmica (a física do calor) para medir o grau de desordem de um sistema. Um copo de vidro intacto tem baixa entropia. Se ele cair no chão e estilhaçar em mil pedaços, a sua entropia (desordem) vai ao máximo.

Em 1948, um gênio da matemática chamado Claude Shannon roubou esse termo da física e o aplicou à informação. Na Ciência de Dados, **Entropia é a medida da impureza, da incerteza ou da "bagunça" de um conjunto de dados.**

Vamos usar a intuição com um jogo de cara ou coroa:

- **Cenário A (A Moeda Justa):** Você joga uma moeda normal. Você não tem ideia se vai dar Cara ou Coroa. A chance é de 50/50. A sua incerteza é máxima. Logo, **a Entropia é Máxima (1.0)**.
  
- **Cenário B (A Moeda Viciada):** Você joga uma moeda que tem "Cara" dos dois lados. Antes mesmo da moeda cair, você já sabe o resultado. Não há incerteza, não há surpresa. Logo, **a Entropia é Mínima (0.0)**.
  

O trabalho de um modelo de Machine Learning é exatamente este: pegar um banco de dados com alta entropia (onde não sabemos quem vai comprar e quem não vai) e fatiá-lo até encontrar grupos com entropia zero (onde temos 100% de certeza do comportamento).

## 3. A Matemática do Caos

Não confie apenas na intuição; confie no cálculo. A fórmula da Entropia de Shannon (representada pela letra $H$) para um problema de classificação é desenhada para penalizar a incerteza.

$$H(S) = - \sum_{i=1}^{c} p_i \log_2 p_i$$

Pode parecer assustador, mas a leitura é simples:

- $S$ é o seu conjunto de dados.
  
- $c$ é o número de classes (ex: "Sim" e "Não").
  
- $p_i$ é a probabilidade (porcentagem) de uma classe ocorrer.
  
- O $\log_2$ (logaritmo na base 2) está ali porque, na computação, medimos a informação em _Bits_ (0 e 1).
  

Se você tem uma carteira de 100 clientes, onde 50 compraram um produto e 50 não compraram, a probabilidade $p$ de cada lado é $0.5$. Se jogarmos isso na fórmula:

$$H(S) = - (0.5 \cdot \log_2(0.5)) - (0.5 \cdot \log_2(0.5)) = 1.0$$

A matemática confirma: um grupo perfeitamente dividido (50/50) tem **Entropia 1** (Caos total). O algoritmo olha para isso e pensa: _"Eu não consigo tomar nenhuma decisão com esse grupo, preciso dividi-lo!"_

## 4. O Ganho de Informação: Como a IA Toma Decisões

Saber a entropia do banco de dados inteiro é apenas o primeiro passo. A verdadeira mágica acontece quando usamos o **Ganho de Informação** (_Information Gain_).

O Ganho de Informação mede o quanto a Entropia _caiu_ depois que usamos uma das nossas colunas para separar os dados. É assim que um dos algoritmos mais famosos do mundo, a **Árvore de Decisão** (_Decision Tree_), funciona por baixo dos panos.

Imagine que o nosso banco de dados tem a Entropia máxima (1.0). Temos duas colunas para tentar adivinhar quem vai comprar um carro de luxo: a coluna "Cor dos Olhos" e a coluna "Salário".

1. **O Teste da Cor dos Olhos:** O algoritmo divide os clientes entre "Olhos Claros" e "Olhos Escuros". Ao analisar os dois novos grupos, ele percebe que, dentro de cada grupo, a proporção de quem comprou e não comprou continua 50/50. A entropia não mudou nada. O Ganho de Informação foi **Zero**. A coluna é descartada.
   
2. **O Teste do Salário:** O algoritmo divide os clientes entre "Salário > 20 mil" e "Salário < 20 mil". No grupo dos ricos, 95% compraram o carro (Entropia quase 0). No grupo dos menos favorecidos, apenas 5% compraram (Entropia quase 0). O caos desapareceu! O Ganho de Informação foi **Altíssimo**.
   

O algoritmo então escolhe a coluna "Salário" como a regra principal do seu sistema. Ele aprendeu sozinho o que importa, guiado apenas pela busca incessante por reduzir a Entropia.

## 5. Na Prática: Calculando o Caos em Python

Em vez de usar uma biblioteca mágica que faz tudo sozinha, vamos ser cientistas. Vamos escrever a matemática da Entropia do zero em Python usando o `NumPy` para ver como o caos é medido numa base de dados de clientes.



```Python
import numpy as np

# ---------------------------------------------------------
# FUNÇÃO: Calculadora de Entropia de Shannon
# ---------------------------------------------------------
def calcular_entropia(coluna_alvo):
    # 1. Conta quantos elementos existem de cada classe (Ex: Sim/Não)
    elementos, contagens = np.unique(coluna_alvo, return_counts=True)
    
    # 2. Calcula a probabilidade (p) de cada classe
    probabilidades = contagens / len(coluna_alvo)
    
    # 3. Aplica a fórmula matemática: -Soma(p * log2(p))
    entropia = -np.sum(probabilidades * np.log2(probabilidades))
    
    return entropia

# ---------------------------------------------------------
# O TESTE: Qual grupo tem mais incerteza?
# ---------------------------------------------------------

# Cenário 1: Caos Total (50% Compraram, 50% Não Compraram)
clientes_caoticos = np.array(['Sim', 'Não', 'Sim', 'Não', 'Sim', 'Não', 'Sim', 'Não'])

# Cenário 2: Quase Certeza (87.5% Compraram, 12.5% Não Compraram)
clientes_organizados = np.array(['Sim', 'Sim', 'Sim', 'Sim', 'Sim', 'Sim', 'Sim', 'Não'])

# Cenário 3: Certeza Absoluta (100% Compraram)
clientes_perfeitos = np.array(['Sim', 'Sim', 'Sim', 'Sim', 'Sim', 'Sim', 'Sim', 'Sim'])

print("--- MEDINDO O CAOS (ENTROPIA) ---")
print(f"Cenário 1 (Caos Total): {calcular_entropia(clientes_caoticos):.4f} bits")
print(f"Cenário 2 (Desbalanceado): {calcular_entropia(clientes_organizados):.4f} bits")
print(f"Cenário 3 (Certeza Absoluta): {calcular_entropia(clientes_perfeitos):.4f} bits")
```

Se você executar este código, a matemática será implacável:

- O Cenário 1 retornará `1.0000` (Incerteza máxima).
  
- O Cenário 2 retornará `0.5436` (A incerteza caiu pela metade, pois a maioria diz "Sim").
  
- O Cenário 3 retornará `0.0000` (Fim do caos. Temos a regra final!).
  

_(Nota técnica: O logaritmo de 0 é indefinido na matemática, mas em bibliotecas otimizadas para ML, como o Scikit-Learn, tratamos $0 \cdot \log(0)$ como $0$ para evitar erros no Cenário 3)._

## Conexões para a Próxima Estação

Compreender a Entropia nos dá um superpoder: a capacidade de avaliar a qualidade da nossa informação. Nós finalmente aprendemos como as máquinas começam a "pensar" e a selecionar quais colunas importam num mar de dados tabulares.

Mas para fazermos essas análises em conjuntos de dados com milhões de linhas, variáveis contínuas e temporais, matrizes simples e bibliotecas matemáticas básicas não serão suficientes. Precisamos de uma estrutura de dados de alto nível que entenda rótulos, índices e operações vetorizadas com a facilidade de uma planilha do Excel, mas com a fúria computacional do Python.

É hora de conhecermos as espadas e os escudos diários de qualquer Cientista de Dados. Nossa próxima parada: **Estação 08 — Data Frames & Series**.