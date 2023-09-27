from sentence_transformers import SentenceTransformer, util
# model_name = 'multi-qa-MiniLM-L6-cos-v1' # 'all-MiniLM-L6-v2'
model_name = 'thenlper/gte-small'
# model_name = 'Supabase/gte-small'
model = SentenceTransformer(model_name)


sentences1 = [
    'Olá, tudo bem?',
    'De onde você é?',
    'Qual a sua idade?',
    'Me fale sobre você',
    'O que você faz?',
    'Onde você trabalha?',
    'Me fale sobre suas experiências profissionais',
    'Me conte um momento de superação',
    'você conhece o chat gpt?',
    'você gosta de andar de bicicleta?',
]

sentences1 = [
    'Hello, how are you?',
    'Where are you from?',
    'How old are you?',
    'Tell me about yourself',
    'What do you do?',
    'Where do you work?',
    'Tell me about your professional experiences',
    'Tell me about a moment of overcoming',
    'do you know the gpt chat?',
    'do you like to ride a bike?'
]

sentences2 = [
    'Olá tudo bem. Como vai você. É um prazer. E aí, como vai?',
    'Onde eu nasci, de onde eu sou, de onde eu venho',
    'Quantos anos eu tenho, qual a minha idade, quantos anos você tem?',
    'Minhas experiências profissionais, onde trabalhei, quantos anos de experiência',
    'Falar mais sobre mim, resumo de quem sou eu'
]

sentences2 = [
    'Hello, how are you. How are you. It is a pleasure. So, how are you?',
    'Where I was born, where I am from, where I come from',
    'How old I am, what my age is, how old are you?',
    'My professional experiences, where I worked, how many years of experience',
    'Tell me more about myself, summary of who I am'
]

#Compute embedding for both lists
embeddings1 = model.encode(sentences1, convert_to_tensor=True)
embeddings2 = model.encode(sentences2, convert_to_tensor=True)

#Compute cosine-similarities
cosine_scores = util.cos_sim(embeddings1, embeddings2)

# print the best sentence pair
for i in range(len(sentences1)):
    j = cosine_scores[i].argmax()
    best_sentence = sentences2[j]
    print("{} \t\t {} \t\t Score: {:.4f}".format(sentences1[i], sentences2[j], cosine_scores[i][j]), cosine_scores[i][:])