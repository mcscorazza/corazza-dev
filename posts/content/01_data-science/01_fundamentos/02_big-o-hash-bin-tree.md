---
title: "Big-O, Hash e Bin Tree"
trail: "Data Science"
line: "Fundamentos"
summary: "Big O, Hash Tables e Árvores Binárias"
---

# Estação 02
## Big O, Hash Tables e Árvores Binárias

| RESUMO            |                                |
| :---------------- | -----------------------------: |
| Palavras:         |                         ~1.400 |
| Tempo de leitura: |                          7 min |
| Linha             |                 01 Fundamentos |
| Progresso:        | `[■■■■----------------] 22.2%` |

### 1. O Problema da Agulha no Palheiro e o Gargalo de Leitura

Na Estação 01, aprendemos a organizar os dados matematicamente usando Matrizes. Mas armazenar a informação é apenas metade da batalha. A outra metade — e o verdadeiro gargalo na Ciência de Dados — é **recuperar** essa informação.

Em um ambiente de Big Data, o processador (CPU) é incrivelmente rápido, mas a memória e o disco são lentos. Se você tem uma base com 10 milhões de clientes e o seu algoritmo precisa ler o arquivo inteiro linha por linha para encontrar o saldo de um único usuário, o gargalo não será a matemática; será o tempo gasto procurando o dado.

Para resolver isso, a Ciência da Computação nos empresta duas de suas armas mais letais: estruturas de dados otimizadas e uma forma matemática de provar a eficiência de um código.

### 2. Notação Big O: O Alfabeto da Eficiência

Como podemos afirmar cientificamente que um código é "rápido"? Medir em segundos é inútil. Um código terrível pode rodar em 0.1 segundos num supercomputador da nuvem, mas travar completamente um notebook comum.

Para sermos justos e universais, usamos a **Notação Big O** (Lê-se "Big Ou"). Ela não mede o tempo no relógio; ela mede o **crescimento assintótico**. Ou seja: como o número de passos que o algoritmo precisa dar aumenta conforme a quantidade de dados ($n$) cresce ao infinito?

Aqui está o espectro de eficiência que você encontrará na prática:

- **O(1) - Tempo Constante (A Mágica):** O Santo Graal. O tempo de execução é sempre o mesmo, seja para 10 ou 10 bilhões de registros. É o acesso direto.
  
- **O(log n) - Tempo Logarítmico (A Eficiência Inteligente):** O algoritmo corta o problema pela metade a cada iteração. Se você tem 1 milhão de registros, ele acha o resultado em cerca de 20 passos. Se você dobrar para 2 milhões, ele precisará de apenas **21 passos**. O crescimento do tempo é quase horizontal.
  
- **O(n) - Tempo Linear (A Força Bruta):** O tempo de execução cresce na mesma proporção dos dados. Ler um livro página por página procurando uma palavra. 1.000 páginas = 1.000 passos.
  
- **O(n²) - Tempo Quadrático (O Pesadelo):** Geralmente causado por _loops_ aninhados (um `for` dentro de outro `for`). Se você dobrar a quantidade de dados, o tempo de execução é multiplicado por quatro. Se multiplicar os dados por 10, o tempo aumenta 100 vezes. É aqui que os servidores travam e as contas de computação em nuvem explodem.
  

### 3. Funções Hash: A Anatomia do Tempo Constante

Se o $O(1)$ é o acesso imediato, a **Hash Function** (Função de Espalhamento) é o motor que o torna possível.

Imagine o guarda-volumes de um museu. A recepcionista não guarda a sua mochila numa pilha aleatória. Ela recebe a mochila, te entrega uma ficha com o número "42" e a coloca no escaninho 42. Quando você volta e apresenta a ficha, ela não olha todos os escaninhos; ela vai direto ao 42.

Na programação, dicionários (`dicts` no Python) funcionam assim através de uma **Tabela Hash**:

1. Você fornece uma "chave" (ex: o email `cliente@gmail.com`).
   
2. A Função Hash realiza uma criptografia matemática leve nessa string, convertendo as letras num número inteiro gigante, e depois usa o "resto da divisão" (módulo) para transformá-lo num endereço de memória exato (ex: posição `1054`).
   
3. O computador lê diretamente a posição `1054`. Zero buscas adicionais. Tempo $O(1)$.
   

#### O Lado Sombrio: Colisões de Hash

Parece perfeito, mas o que acontece se a Função Hash calcular o mesmo endereço de memória para duas chaves completamente diferentes? Isso se chama **Colisão**. Voltando à metáfora, é como se a recepcionista tentasse colocar duas mochilas no escaninho 42.

Linguagens como Python resolvem isso com elegância usando técnicas como _Open Addressing_ (procurar o próximo escaninho vazio) ou _Chaining_ (criar uma pequena lista dentro do escaninho 42). No entanto, se o seu sistema tiver muitas colisões, aquela mágica de buscar em $O(1)$ começa a degradar para um lento $O(n)$, pois o computador terá que procurar dentro da gaveta lotada. É por isso que criar Tabelas Hash exige memória extra (para manter os escaninhos vazios e evitar trânsito). Aqui vemos o eterno dilema da computação: **trocamos consumo de memória por velocidade de processamento.**

### 4. Árvores Binárias: A Arte de Dividir para Conquistar

As Tabelas Hash são geniais, mas são caóticas. Elas espalham os dados aleatoriamente na memória. Se você pedir a uma Tabela Hash: "Mostre-me os 10 clientes com as maiores rendas", ela será inútil. Para dados ordenados e consultas de intervalo (como filtros de datas), usamos a **Árvore Binária de Busca** (BST - _Binary Search Tree_).

A regra de construção é rigorosa:

1. O primeiro dado é a "Raiz" (topo).
   
2. Qualquer dado **menor** vai para o nó da **esquerda**.
   
3. Qualquer dado **maior** vai para o nó da **direita**.
   

Para buscar um valor, você desce a árvore comparando as bifurcações. A cada nível que você desce, você ignora 50% de toda a base de dados. Isso é a essência do $O(\log n)$.

#### O Problema do Desbalanceamento

Porém, existe uma armadilha crítica. Imagine que você tenta inserir dados que _já estão em ordem_ (ex: 1, 2, 3, 4, 5). O número 2 vai para a direita do 1. O 3 vai para a direita do 2...

O resultado não será uma árvore ramificada, mas sim uma linha reta pendendo totalmente para a direita. Parabéns, você acabou de criar uma Lista Linear disfarçada de Árvore! A busca logarítmica rápida $O(\log n)$ foi destruída e voltou a ser a lenta $O(n)$.

Para evitar isso, bancos de dados modernos (que rodam SQL) não usam árvores binárias simples; eles usam Árvores Balanceadas (como _Red-Black Trees_ ou _B-Trees_), que reorganizam os próprios galhos automaticamente cada vez que um dado é inserido, garantindo que a árvore nunca fique "torta".

### 5. Na Prática: Entendendo a Busca Linear vs. Busca Binária

Vamos esquecer as funções prontas do Python por um momento e escrever nossos próprios algoritmos de busca para ver a diferença entre o comportamento Ingênuo $O(n)$ e o Inteligente $O(\log n)$.



```python
import time

# Criando uma base ordenada de 10 milhões de IDs de clientes
base_clientes = list(range(10_000_000))
alvo = 9_999_999

# ---------------------------------------------------------
# ALGORITMO 1: Busca Linear - O(n)
# O computador varre linha por linha.
# ---------------------------------------------------------
def busca_linear(lista, alvo):
    passos = 0
    for item in lista:
        passos += 1
        if item == alvo:
            return passos
    return passos

inicio = time.time()
passos_linear = busca_linear(base_clientes, alvo)
tempo_linear = time.time() - inicio

print(f"Busca Linear: {passos_linear:,} passos. (Tempo: {tempo_linear:.5f}s)")

# ---------------------------------------------------------
# ALGORITMO 2: Busca Binária - O(log n)
# Cortando o problema pela metade a cada iteração.
# ---------------------------------------------------------
def busca_binaria(lista, alvo):
    passos = 0
    inicio = 0
    fim = len(lista) - 1
    
    while inicio <= fim:
        passos += 1
        meio = (inicio + fim) // 2  # Encontra o índice central
        
        if lista[meio] == alvo:
            return passos
        elif lista[meio] < alvo:
            inicio = meio + 1       # Ignora a metade da esquerda
        else:
            fim = meio - 1          # Ignora a metade da direita
            
    return passos

inicio = time.time()
passos_binaria = busca_binaria(base_clientes, alvo)
tempo_binaria = time.time() - inicio

print(f"Busca Binária: {passos_binaria:,} passos. (Tempo: {tempo_binaria:.5f}s)")
```

**O Resultado Prático:**

Enquanto a Busca Linear precisará de **10 milhões de passos** para encontrar o último cliente da lista, a Busca Binária (graças ao poder do logaritmo) encontrará o mesmo cliente em, no máximo, **24 passos**. A diferença de performance não é apenas visível; ela é a fundação que permite que o Google ou a Amazon pesquisem os seus dados em milissegundos.