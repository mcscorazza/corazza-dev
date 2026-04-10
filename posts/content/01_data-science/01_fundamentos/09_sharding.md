---
title: "Sharding"
trail: "Data Science"
line: "Fundamentos"
summary: "Sharding e Particionamento Horizontal"
---

## Estação 09
> Sharding e Particionamento Horizontal

## 1. O Limite Físico do Hardware

Nas estações anteriores, nós preparamos os nossos dados com maestria. Formatar arquivos em *Tidy Data* e carregá-los em *Data Frames* na memória RAM funciona perfeitamente quando você tem planilhas com alguns milhões de linhas.

Mas o que acontece quando o seu projeto sai do laboratório e ganha o mundo real?

Imagine um sistema de instrumentação recebendo telemetria contínua. Milhares de vagões de trem em movimento espalhados por uma malha ferroviária, com sensores enviando dados de geolocalização, vibração e temperatura a cada segundo. Em poucas semanas, você não terá mais "milhões" de linhas; você terá bilhões. O seu banco de dados atingirá a casa dos Terabytes.

Nesse cenário, você se depara com o limite físico da engenharia. Quando um servidor de banco de dados fica lento por excesso de dados, a primeira reação de um engenheiro novato é o **Escalonamento Vertical (Scale Up)**: comprar mais memória RAM, um processador mais rápido e discos SSD mais caros.

Mas o Escalonamento Vertical tem um teto. Chega um momento em que você simplesmente não consegue comprar um computador maior, ou o custo financeiro para manter essa supermáquina ligada na nuvem destrói o orçamento do projeto. É neste ponto de ruptura que a Ciência de Dados precisa da ajuda da infraestrutura para realizar o **Escalonamento Horizontal (Scale Out)**. E a técnica suprema para isso chama-se *Sharding*.

## 2. O Que é Sharding? (A Arte de Fatiar)

*Sharding* (que pode ser traduzido como "fragmentação" ou "estilhaçamento") é o processo de dividir uma tabela gigantesca em pedaços menores e distribuir esses pedaços por vários servidores diferentes (chamados de *Nodes* ou Nós).

É crucial não confundir Sharding com a Normalização que vimos na Álgebra Relacional (Estação 03).

- Na **Normalização**, nós dividimos a tabela verticalmente (colocamos as colunas de 'Clientes' num servidor e as colunas de 'Vendas' em outro).
- No **Sharding**, nós dividimos a tabela **horizontalmente**. O esquema da tabela continua exatamente o mesmo, mas as linhas são separadas.

Por exemplo, um banco de dados *shardado* pode guardar os dados dos vagões de ID 1 a 500 no Servidor A, os vagões de 501 a 1000 no Servidor B, e assim por diante. Para o usuário final ou para a sua ferramenta de visualização, parece que existe apenas um banco de dados mágico e unificado. Mas por baixo dos panos, uma rede inteligente está roteando cada consulta para a máquina física correta.

## 3. A Chave de Ouro: Como Escolher a Shard Key

O sucesso ou o fracasso absoluto de uma arquitetura particionada depende de uma única decisão de design: a escolha da **Shard Key** (Chave de Fragmentação).

A Shard Key é a coluna (ou regra) que o sistema usará para decidir para qual servidor enviar uma nova linha de dados. Se você escolher a chave errada, você criará um **Hotspot** (Ponto Quente) — uma falha catastrófica onde um servidor recebe todo o tráfego de dados e trava, enquanto os outros servidores ficam ociosos.

Aqui estão as três estratégias universais de roteamento:

### A. Particionamento por Intervalo (Range/Dynamic Sharding)

Você divide os dados com base em uma faixa de valores. O exemplo mais clássico é o tempo.

- *Servidor 1:* Recebe todos os dados de Janeiro e Fevereiro.
- *Servidor 2:* Recebe todos os dados de Março e Abril. **O Perigo:** Se o seu sistema analisa dados em tempo real, o "Servidor 2" receberá 100% da carga de escrita durante os meses de Março e Abril, enquanto o "Servidor 1" não fará nada. É uma receita garantida para criar um Hotspot.

### B. Particionamento por Diretório (Entity Sharding)

Você cria uma tabela de roteamento (um "mapa") que diz exatamente para onde cada dado vai com base em uma entidade geográfica ou de negócio.

- *Servidor 1:* Guarda apenas dados da região Sul.
- *Servidor 2:* Guarda apenas dados da região Sudeste. **O Perigo:** Regiões não são iguais. Se a malha ferroviária do Sudeste for dez vezes maior que a do Sul, o Servidor 2 vai encher o disco rígido rapidamente e a arquitetura ficará desbalanceada.

### C. Particionamento por Hash (Algorithmic Sharding)

A escolha favorita para sistemas de Big Data de alta performance (como bancos NoSQL modernos). Você pega um identificador único, como o "ID do Vagão" ou o "ID do Sensor", e passa por uma Função Hash (lembra-se da Estação 02?). A matemática da função embaralha o ID e o transforma num número que direciona o dado de forma perfeitamente aleatória e uniforme entre todos os servidores disponíveis. **A Vantagem:** A carga de processamento e armazenamento é dividida igualmente, garantindo que nenhum servidor sofra sozinho.

## 4. O Preço a Pagar: Por Que Evitamos Sharding Até o Último Segundo?

Se o Sharding resolve o limite físico do hardware, por que não começamos todos os projetos com ele? Porque na Ciência da Computação, não existe almoço grátis. Ao fragmentar os seus dados, você perde o "superpoder" da Álgebra Relacional.

Lembra-se dos **Joins** da Estação 04? Fazer um `INNER JOIN` é rápido quando as duas tabelas estão no mesmo disco rígido. Mas e se você precisar cruzar a tabela de "Manutenção" (que está no Servidor A) com a tabela de "Telemetria" (que foi particionada e está espalhada pelos Servidores B, C e D)?

O banco de dados terá que enviar a consulta pela rede de internet para todos os servidores, esperar que eles processem as suas fatias, receber os resultados de volta e juntar tudo antes de devolver para você. Isso é chamado de consulta *Cross-Shard*. Ela é absurdamente lenta, complexa de programar e costuma derrubar a performance do sistema. É por isso que o particionamento horizontal é a cartada final na manga de um Arquiteto de Dados.

## 5. Na Prática: Simulando um Roteador de Hash em Python

Como um banco de dados decide para qual máquina enviar um registro de telemetria em milissegundos? Vamos construir um simulador simples de **Particionamento por Hash** usando Python para distribuir leituras de sensores uniformemente entre 3 servidores.

Python

```
import hashlib

# 1. Definindo a nossa infraestrutura
servidores_disponiveis = ["Servidor_A", "Servidor_B", "Servidor_C"]
banco_de_dados = {"Servidor_A": [], "Servidor_B": [], "Servidor_C": []}

# 2. A Função de Roteamento (A Mágica do Hash)
def determinar_shard(id_sensor, total_servidores):
    # Converte o ID do sensor num Hash criptográfico (número gigante e caótico)
    hash_valor = int(hashlib.md5(id_sensor.encode('utf-8')).hexdigest(), 16)
    
    # Usa o 'resto da divisão' (Módulo) para encontrar um índice entre 0 e 2
    indice_servidor = hash_valor % total_servidores
    return indice_servidor

# 3. Simulando a chegada massiva de dados de telemetria
dados_entrada = [
    {"sensor_id": "VAGAO-001", "leitura": "Vibração: 2.4G"},
    {"sensor_id": "VAGAO-002", "leitura": "Vibração: 1.1G"},
    {"sensor_id": "VAGAO-003", "leitura": "Vibração: 5.6G"},
    {"sensor_id": "VAGAO-004", "leitura": "Vibração: 0.8G"},
    {"sensor_id": "VAGAO-005", "leitura": "Vibração: 3.2G"}
]

print("--- ROTEANDO DADOS PARA OS SHARDS ---\n")

for dado in dados_entrada:
    # O roteador decide o destino usando a matemática do Hash
    indice = determinar_shard(dado["sensor_id"], len(servidores_disponiveis))
    servidor_destino = servidores_disponiveis[indice]
    
    # Gravando o dado no servidor escolhido
    banco_de_dados[servidor_destino].append(dado)
    print(f"[{dado['sensor_id']}] -> Roteado para {servidor_destino}")

print("\n--- STATUS DOS SERVIDORES (Distribuição de Carga) ---")
for servidor, registros in banco_de_dados.items():
    print(f"{servidor}: Guardando {len(registros)} registros.")
```

Se você executar o código repetidas vezes ou adicionar mais vagões, verá que o Hash garante que os dados não fiquem amontoados em um único lugar. O sistema distribui a carga elegantemente sem que o programador precise criar regras manuais intermináveis.

## Conexões para a Próxima Estação

Com o conhecimento sobre Sharding, encerramos as nossas preocupações sobre **como armazenar** dados em escala monumental. A infraestrutura está pronta para suportar o mundo real.

No entanto, sistemas estilhaçados (*sharded*) são incríveis para guardar e ler pequenos registros individuais (como atualizar a temperatura de um sensor). Mas o que acontece se o CEO da empresa quiser ver a **"Média Histórica de Temperatura de todos os vagões, agrupada por trimestre e por região geográfica, nos últimos 5 anos"**?

Fazer esse cálculo massivo varrendo o banco de dados operacional em tempo real vai travar a operação da empresa inteira. Para análises corporativas profundas e agregação de dados temporais, precisamos construir estruturas gigantescas chamadas Cubos de Dados.

Prepare-se para sair da infraestrutura pura e entrar na Inteligência de Negócios (*Business Intelligence*). A nossa próxima parada é a **Estação 10 — OLAP (Online Analytical Processing)**.