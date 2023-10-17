/**
 * @typedef {import('./utils/hub.js').PretrainedOptions} PretrainedOptions
 */
/**
 * Utility factory method to build a [`Pipeline`] object.
 *
 * @param {string} task The task defining which pipeline will be returned. Currently accepted tasks are:
 *  - `"audio-classification"`: will return a `AudioClassificationPipeline`.
 *  - `"automatic-speech-recognition"`: will return a `AutomaticSpeechRecognitionPipeline`.
 *  - `"feature-extraction"`: will return a `FeatureExtractionPipeline`.
 *  - `"fill-mask"`: will return a `FillMaskPipeline`.
 *  - `"image-classification"`: will return a `ImageClassificationPipeline`.
 *  - `"image-segmentation"`: will return a `ImageSegmentationPipeline`.
 *  - `"image-to-text"`: will return a `ImageToTextPipeline`.
 *  - `"object-detection"`: will return a `ObjectDetectionPipeline`.
 *  - `"question-answering"`: will return a `QuestionAnsweringPipeline`.
 *  - `"summarization"`: will return a `SummarizationPipeline`.
 *  - `"text2text-generation"`: will return a `Text2TextGenerationPipeline`.
 *  - `"text-classification"` (alias "sentiment-analysis" available): will return a `TextClassificationPipeline`.
 *  - `"text-generation"`: will return a `TextGenerationPipeline`.
 *  - `"token-classification"` (alias "ner" available): will return a `TokenClassificationPipeline`.
 *  - `"translation"`: will return a `TranslationPipeline`.
 *  - `"translation_xx_to_yy"`: will return a `TranslationPipeline`.
 *  - `"zero-shot-classification"`: will return a `ZeroShotClassificationPipeline`.
 *  - `"zero-shot-image-classification"`: will return a `ZeroShotImageClassificationPipeline`.
 * @param {string} [model=null] The name of the pre-trained model to use. If not specified, the default model for the task will be used.
 * @param {PretrainedOptions} [options] Optional parameters for the pipeline.
 * @returns {Promise<Pipeline>} A Pipeline object for the specified task.
 * @throws {Error} If an unsupported pipeline is requested.
 */
export function pipeline(task: string, model?: string, { quantized, progress_callback, config, cache_dir, local_files_only, revision, }?: PretrainedOptions): Promise<Pipeline>;
declare const Pipeline_base: new () => {
    (...args: any[]): any;
    _call(...args: any[]): any;
};
/**
 * The Pipeline class is the class from which all pipelines inherit.
 * Refer to this class for methods shared across different pipelines.
 * @extends Callable
 */
export class Pipeline extends Pipeline_base {
    /**
     * Create a new Pipeline.
     * @param {Object} options An object containing the following properties:
     * @param {string} [options.task] The task of the pipeline. Useful for specifying subtasks.
     * @param {PreTrainedModel} [options.model] The model to use.
     * @param {PreTrainedTokenizer} [options.tokenizer=null] The tokenizer to use (if any).
     * @param {Processor} [options.processor=null] The processor to use (if any).
     */
    constructor({ task, model, tokenizer, processor }: {
        task?: string;
        model?: PreTrainedModel;
        tokenizer?: PreTrainedTokenizer;
        processor?: Processor;
    });
    task: string;
    model: PreTrainedModel;
    tokenizer: PreTrainedTokenizer;
    processor: Processor;
    /**
     * Disposes the model.
     * @returns {Promise<void>} A promise that resolves when the model has been disposed.
     */
    dispose(): Promise<void>;
    /**
     * Executes the task associated with the pipeline.
     * @param {any} texts The input texts to be processed.
     * @param {...any} args Additional arguments.
     * @returns {Promise<any>} A promise that resolves to an array containing the inputs and outputs of the task.
     */
    _call(texts: any, ...args: any[]): Promise<any>;
}
/**
 * Text classification pipeline using any `ModelForSequenceClassification`.
 *
 * **Example:** Sentiment-analysis w/ `Xenova/distilbert-base-uncased-finetuned-sst-2-english`.
 * ```javascript
 * let classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
 * let output = await classifier('I love transformers!');
 * // [{ label: 'POSITIVE', score: 0.999788761138916 }]
 * ```
 *
 * **Example:** Multilingual sentiment-analysis w/ `Xenova/bert-base-multilingual-uncased-sentiment` (and return top 5 classes).
 * ```javascript
 * let classifier = await pipeline('sentiment-analysis', 'Xenova/bert-base-multilingual-uncased-sentiment');
 * let output = await classifier('Le meilleur film de tous les temps.', { topk: 5 });
 * // [
 * //   { label: '5 stars', score: 0.9610759615898132 },
 * //   { label: '4 stars', score: 0.03323351591825485 },
 * //   { label: '3 stars', score: 0.0036155181005597115 },
 * //   { label: '1 star', score: 0.0011325967498123646 },
 * //   { label: '2 stars', score: 0.0009423971059732139 }
 * // ]
 * ```
 *
 * **Example:** Toxic comment classification w/ `Xenova/toxic-bert` (and return all classes).
 * ```javascript
 * let classifier = await pipeline('text-classification', 'Xenova/toxic-bert');
 * let output = await classifier('I hate you!', { topk: null });
 * // [
 * //   { label: 'toxic', score: 0.9593140482902527 },
 * //   { label: 'insult', score: 0.16187334060668945 },
 * //   { label: 'obscene', score: 0.03452680632472038 },
 * //   { label: 'identity_hate', score: 0.0223250575363636 },
 * //   { label: 'threat', score: 0.019197041168808937 },
 * //   { label: 'severe_toxic', score: 0.005651099607348442 }
 * // ]
 * ```
 */
export class TextClassificationPipeline extends Pipeline {
    /**
     * Executes the text classification task.
     * @param {any} texts The input texts to be classified.
     * @param {Object} options An optional object containing the following properties:
     * @param {number} [options.topk=1] The number of top predictions to be returned.
     * @returns {Promise<Object[]|Object>} A promise that resolves to an array or object containing the predicted labels and scores.
     */
    _call(texts: any, { topk }?: {
        topk?: number;
    }): Promise<any[] | any>;
}
/**
 * Named Entity Recognition pipeline using any `ModelForTokenClassification`.
 *
 * **Example:** Perform named entity recognition with `Xenova/bert-base-NER`.
 * ```javascript
 * let classifier = await pipeline('token-classification', 'Xenova/bert-base-NER');
 * let output = await classifier('My name is Sarah and I live in London');
 * // [
 * //   { entity: 'B-PER', score: 0.9980202913284302, index: 4, word: 'Sarah' },
 * //   { entity: 'B-LOC', score: 0.9994474053382874, index: 9, word: 'London' }
 * // ]
 * ```
 *
 * **Example:** Perform named entity recognition with `Xenova/bert-base-NER` (and return all labels).
 * ```javascript
 * let classifier = await pipeline('token-classification', 'Xenova/bert-base-NER');
 * let output = await classifier('Sarah lives in the United States of America', { ignore_labels: [] });
 * // [
 * //   { entity: 'B-PER', score: 0.9966587424278259, index: 1, word: 'Sarah' },
 * //   { entity: 'O', score: 0.9987385869026184, index: 2, word: 'lives' },
 * //   { entity: 'O', score: 0.9990072846412659, index: 3, word: 'in' },
 * //   { entity: 'O', score: 0.9988298416137695, index: 4, word: 'the' },
 * //   { entity: 'B-LOC', score: 0.9995510578155518, index: 5, word: 'United' },
 * //   { entity: 'I-LOC', score: 0.9990395307540894, index: 6, word: 'States' },
 * //   { entity: 'I-LOC', score: 0.9986724853515625, index: 7, word: 'of' },
 * //   { entity: 'I-LOC', score: 0.9975294470787048, index: 8, word: 'America' }
 * // ]
 * ```
 */
export class TokenClassificationPipeline extends Pipeline {
    /**
     * Executes the token classification task.
     * @param {any} texts The input texts to be classified.
     * @param {Object} options An optional object containing the following properties:
     * @returns {Promise<Object[]|Object>} A promise that resolves to an array or object containing the predicted labels and scores.
     */
    _call(texts: any, { ignore_labels, }?: any): Promise<any[] | any>;
}
/**
 * @typedef {object} QuestionAnsweringResult
 * @property {string} answer - The answer.
 * @property {number} score - The score.
 */
/**
 * @typedef {Promise<QuestionAnsweringResult|QuestionAnsweringResult[]>} QuestionAnsweringReturnType
 */
/**
 * Question Answering pipeline using any `ModelForQuestionAnswering`.
 *
 * **Example:** Run question answering with `Xenova/distilbert-base-uncased-distilled-squad`.
 * ```javascript
 * let question = 'Who was Jim Henson?';
 * let context = 'Jim Henson was a nice puppet.';
 *
 * let answerer = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad');
 * let output = await answerer(question, context);
 * // {
 * //   "answer": "a nice puppet",
 * //   "score": 0.5768911502526741
 * // }
 * ```
 */
export class QuestionAnsweringPipeline extends Pipeline {
    /**
     * Executes the question answering task.
     * @param {string|string[]} question The question(s) to be answered.
     * @param {string|string[]} context The context(s) where the answer(s) can be found.
     * @param {Object} options An optional object containing the following properties:
     * @param {number} [options.topk=1] The number of top answer predictions to be returned.
     * @returns {QuestionAnsweringReturnType} A promise that resolves to an array or object
     * containing the predicted answers and scores.
     */
    _call(question: string | string[], context: string | string[], { topk }?: {
        topk?: number;
    }): QuestionAnsweringReturnType;
}
/**
 * Masked language modeling prediction pipeline using any `ModelWithLMHead`.
 *
 * **Example:** Perform masked language modelling (a.k.a. "fill-mask") with `Xenova/bert-base-uncased`.
 * ```javascript
 * let unmasker = await pipeline('fill-mask', 'Xenova/bert-base-cased');
 * let output = await unmasker('The goal of life is [MASK].');
 * // [
 * //   { token_str: 'survival', score: 0.06137419492006302, token: 8115, sequence: 'The goal of life is survival.' },
 * //   { token_str: 'love', score: 0.03902450203895569, token: 1567, sequence: 'The goal of life is love.' },
 * //   { token_str: 'happiness', score: 0.03253183513879776, token: 9266, sequence: 'The goal of life is happiness.' },
 * //   { token_str: 'freedom', score: 0.018736306577920914, token: 4438, sequence: 'The goal of life is freedom.' },
 * //   { token_str: 'life', score: 0.01859794743359089, token: 1297, sequence: 'The goal of life is life.' }
 * // ]
 * ```
 *
 * **Example:** Perform masked language modelling (a.k.a. "fill-mask") with `Xenova/bert-base-cased` (and return top result).
 * ```javascript
 * let unmasker = await pipeline('fill-mask', 'Xenova/bert-base-cased');
 * let output = await unmasker('The Milky Way is a [MASK] galaxy.', { topk: 1 });
 * // [{ token_str: 'spiral', score: 0.6299987435340881, token: 14061, sequence: 'The Milky Way is a spiral galaxy.' }]
 * ```
 */
export class FillMaskPipeline extends Pipeline {
    /**
     * Fill the masked token in the text(s) given as inputs.
     * @param {any} texts The masked input texts.
     * @param {Object} options An optional object containing the following properties:
     * @param {number} [options.topk=5] The number of top predictions to be returned.
     * @returns {Promise<Object[]|Object>} A promise that resolves to an array or object containing the predicted tokens and scores.
     */
    _call(texts: any, { topk }?: {
        topk?: number;
    }): Promise<any[] | any>;
}
/**
 * Text2TextGenerationPipeline class for generating text using a model that performs text-to-text generation tasks.
 *
 * **Example:** Text-to-text generation w/ `Xenova/LaMini-Flan-T5-783M`.
 * ```javascript
 * let generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M');
 * let output = await generator('how can I become more healthy?', {
 *   max_new_tokens: 100,
 * });
 * // [ 'To become more healthy, you can: 1. Eat a balanced diet with plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. 2. Stay hydrated by drinking plenty of water. 3. Get enough sleep and manage stress levels. 4. Avoid smoking and excessive alcohol consumption. 5. Regularly exercise and maintain a healthy weight. 6. Practice good hygiene and sanitation. 7. Seek medical attention if you experience any health issues.' ]
 * ```
 */
export class Text2TextGenerationPipeline extends Pipeline {
    _key: any;
    /**
     * Fill the masked token in the text(s) given as inputs.
     * @param {string|string[]} texts The text or array of texts to be processed.
     * @param {Object} [options={}] Options for the fill-mask pipeline.
     * @param {number} [options.topk=5] The number of top-k predictions to return.
     * @returns {Promise<any>} An array of objects containing the score, predicted token, predicted token string,
     * and the sequence with the predicted token filled in, or an array of such arrays (one for each input text).
     * If only one input text is given, the output will be an array of objects.
     * @throws {Error} When the mask token is not found in the input text.
     */
    _call(texts: string | string[], generate_kwargs?: {}): Promise<any>;
}
/**
 * A pipeline for summarization tasks, inheriting from Text2TextGenerationPipeline.
 *
 * **Example:** Summarization w/ `Xenova/distilbart-cnn-6-6`.
 * ```javascript
 * let text = 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, ' +
 *   'and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. ' +
 *   'During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest ' +
 *   'man-made structure in the world, a title it held for 41 years until the Chrysler Building in New ' +
 *   'York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to ' +
 *   'the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the ' +
 *   'Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second ' +
 *   'tallest free-standing structure in France after the Millau Viaduct.';
 *
 * let generator = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
 * let output = await generator(text, {
 *   max_new_tokens: 100,
 * });
 * // [{ summary_text: ' The Eiffel Tower is about the same height as an 81-storey building and the tallest structure in Paris. It is the second tallest free-standing structure in France after the Millau Viaduct.' }]
 * ```
 */
export class SummarizationPipeline extends Text2TextGenerationPipeline {
    _key: string;
}
/**
 * Translates text from one language to another.
 *
 * **Example:** Multilingual translation w/ `Xenova/nllb-200-distilled-600M`.
 *
 * See [here](https://github.com/facebookresearch/flores/blob/main/flores200/README.md#languages-in-flores-200)
 * for the full list of languages and their corresponding codes.
 *
 * ```javascript
 * let translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M');
 * let output = await translator('जीवन एक चॉकलेट बॉक्स की तरह है।', {
 *   src_lang: 'hin_Deva', // Hindi
 *   tgt_lang: 'fra_Latn', // French
 * });
 * // [{ translation_text: 'La vie est comme une boîte à chocolat.' }]
 * ```
 *
 * **Example:** Multilingual translation w/ `Xenova/m2m100_418M`.
 *
 * See [here](https://huggingface.co/facebook/m2m100_418M#languages-covered)
 * for the full list of languages and their corresponding codes.
 *
 * ```javascript
 * let translator = await pipeline('translation', 'Xenova/m2m100_418M');
 * let output = await translator('生活就像一盒巧克力。', {
 *   src_lang: 'zh', // Chinese
 *   tgt_lang: 'en', // English
 * });
 * // [{ translation_text: 'Life is like a box of chocolate.' }]
 * ```
 *
 * **Example:** Multilingual translation w/ `Xenova/mbart-large-50-many-to-many-mmt`.
 *
 * See [here](https://huggingface.co/facebook/mbart-large-50-many-to-many-mmt#languages-covered)
 * for the full list of languages and their corresponding codes.
 *
 * ```javascript
 * let translator = await pipeline('translation', 'Xenova/mbart-large-50-many-to-many-mmt');
 * let output = await translator('संयुक्त राष्ट्र के प्रमुख का कहना है कि सीरिया में कोई सैन्य समाधान नहीं है', {
 *   src_lang: 'hi_IN', // Hindi
 *   tgt_lang: 'fr_XX', // French
 * });
 * // [{ translation_text: 'Le chef des Nations affirme qu 'il n 'y a military solution in Syria.' }]
 * ```
 */
export class TranslationPipeline extends Text2TextGenerationPipeline {
    _key: string;
}
/**
 * Language generation pipeline using any `ModelWithLMHead` or `ModelForCausalLM`.
 * This pipeline predicts the words that will follow a specified text prompt.
 * NOTE: For the full list of generation parameters, see [`GenerationConfig`](./utils/generation#module_utils/generation.GenerationConfig).
 *
 * **Example:** Text generation with `Xenova/distilgpt2` (default settings).
 * ```javascript
 * let text = 'I enjoy walking with my cute dog,';
 * let classifier = await pipeline('text-generation', 'Xenova/distilgpt2');
 * let output = await classifier(text);
 * // [{ generated_text: "I enjoy walking with my cute dog, and I love to play with the other dogs." }]
 * ```
 *
 * **Example:** Text generation with `Xenova/distilgpt2` (custom settings).
 * ```javascript
 * let text = 'Once upon a time, there was';
 * let classifier = await pipeline('text-generation', 'Xenova/distilgpt2');
 * let output = await classifier(text, {
 *   temperature: 2,
 *   max_new_tokens: 10,
 *   repetition_penalty: 1.5,
 *   no_repeat_ngram_size: 2,
 *   num_beams: 2,
 *   num_return_sequences: 2,
 * });
 * // [{
 * //   "generated_text": "Once upon a time, there was an abundance of information about the history and activities that"
 * // }, {
 * //   "generated_text": "Once upon a time, there was an abundance of information about the most important and influential"
 * // }]
 * ```
 *
 * **Example:** Run code generation with `Xenova/codegen-350M-mono`.
 * ```javascript
 * let text = 'def fib(n):';
 * let classifier = await pipeline('text-generation', 'Xenova/codegen-350M-mono');
 * let output = await classifier(text, {
 *   max_new_tokens: 44,
 * });
 * // [{
 * //   generated_text: 'def fib(n):\n' +
 * //     '    if n == 0:\n' +
 * //     '        return 0\n' +
 * //     '    elif n == 1:\n' +
 * //     '        return 1\n' +
 * //     '    else:\n' +
 * //     '        return fib(n-1) + fib(n-2)\n'
 * // }]
 * ```
 */
export class TextGenerationPipeline extends Pipeline {
    /**
     * Generates text based on an input prompt.
     * @param {any} texts The input prompt or prompts to generate text from.
     * @param {Object} [generate_kwargs={}] Additional arguments for text generation.
     * @returns {Promise<any>} The generated text or texts.
     */
    _call(texts: any, generate_kwargs?: any): Promise<any>;
}
/**
 * NLI-based zero-shot classification pipeline using a `ModelForSequenceClassification`
 * trained on NLI (natural language inference) tasks. Equivalent of `text-classification`
 * pipelines, but these models don't require a hardcoded number of potential classes, they
 * can be chosen at runtime. It usually means it's slower but it is **much** more flexible.
 *
 * **Example:** Zero shot classification with `Xenova/mobilebert-uncased-mnli`.
 * ```javascript
 * let text = 'Last week I upgraded my iOS version and ever since then my phone has been overheating whenever I use your app.';
 * let labels = [ 'mobile', 'billing', 'website', 'account access' ];
 * let classifier = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli');
 * let output = await classifier(text, labels);
 * // {
 * //   sequence: 'Last week I upgraded my iOS version and ever since then my phone has been overheating whenever I use your app.',
 * //   labels: [ 'mobile', 'website', 'billing', 'account access' ],
 * //   scores: [ 0.5562091040482018, 0.1843621307860853, 0.13942646639336376, 0.12000229877234923 ]
 * // }
 * ```
 *
 * **Example:** Zero shot classification with `Xenova/nli-deberta-v3-xsmall` (multi-label).
 * ```javascript
 * let text = 'I have a problem with my iphone that needs to be resolved asap!';
 * let labels = [ 'urgent', 'not urgent', 'phone', 'tablet', 'computer' ];
 * let classifier = await pipeline('zero-shot-classification', 'Xenova/nli-deberta-v3-xsmall');
 * let output = await classifier(text, labels, { multi_label: true });
 * // {
 * //   sequence: 'I have a problem with my iphone that needs to be resolved asap!',
 * //   labels: [ 'urgent', 'phone', 'computer', 'tablet', 'not urgent' ],
 * //   scores: [ 0.9958870956360275, 0.9923963400697035, 0.002333537946160235, 0.0015134138567598765, 0.0010699384208377163 ]
 * // }
 * ```
 */
export class ZeroShotClassificationPipeline extends Pipeline {
    /**
     * Create a new ZeroShotClassificationPipeline.
     * @param {Object} options An object containing the following properties:
     * @param {string} [options.task] The task of the pipeline. Useful for specifying subtasks.
     * @param {PreTrainedModel} [options.model] The model to use.
     * @param {PreTrainedTokenizer} [options.tokenizer] The tokenizer to use.
     */
    constructor(options: {
        task?: string;
        model?: PreTrainedModel;
        tokenizer?: PreTrainedTokenizer;
    });
    label2id: {
        [k: string]: any;
    };
    entailment_id: any;
    contradiction_id: any;
    /**
     * @param {any[]} texts
     * @param {string[]} candidate_labels
     * @param {Object} options Additional options:
     * @param {string} [options.hypothesis_template="This example is {}."] The template used to turn each
     * candidate label into an NLI-style hypothesis. The candidate label will replace the {} placeholder.
     * @param {boolean} [options.multi_label=false] Whether or not multiple candidate labels can be true.
     * If `false`, the scores are normalized such that the sum of the label likelihoods for each sequence
     * is 1. If `true`, the labels are considered independent and probabilities are normalized for each
     * candidate by doing a softmax of the entailment score vs. the contradiction score.
     * @return {Promise<Object|Object[]>} The prediction(s), as a map (or list of maps) from label to score.
     */
    _call(texts: any[], candidate_labels: string[], { hypothesis_template, multi_label, }?: {
        hypothesis_template?: string;
        multi_label?: boolean;
    }): Promise<any | any[]>;
}
/**
 * Feature extraction pipeline using no model head. This pipeline extracts the hidden
 * states from the base transformer, which can be used as features in downstream tasks.
 *
 * **Example:** Run feature extraction with `bert-base-uncased` (without pooling/normalization).
 * ```javascript
 * let extractor = await pipeline('feature-extraction', 'Xenova/bert-base-uncased', { revision: 'default' });
 * let output = await extractor('This is a simple test.');
 * // Tensor {
 * //   type: 'float32',
 * //   data: Float32Array [0.05939924716949463, 0.021655935794115067, ...],
 * //   dims: [1, 8, 768]
 * // }
 * ```
 *
 * **Example:** Run feature extraction with `bert-base-uncased` (with pooling/normalization).
 * ```javascript
 * let extractor = await pipeline('feature-extraction', 'Xenova/bert-base-uncased', { revision: 'default' });
 * let output = await extractor('This is a simple test.', { pooling: 'mean', normalize: true });
 * // Tensor {
 * //   type: 'float32',
 * //   data: Float32Array [0.03373778983950615, -0.010106077417731285, ...],
 * //   dims: [1, 768]
 * // }
 * ```
 *
 * **Example:** Calculating embeddings with `sentence-transformers` models.
 * ```javascript
 * let extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
 * let output = await extractor('This is a simple test.', { pooling: 'mean', normalize: true });
 * // Tensor {
 * //   type: 'float32',
 * //   data: Float32Array [0.09094982594251633, -0.014774246141314507, ...],
 * //   dims: [1, 384]
 * // }
 * ```
 */
export class FeatureExtractionPipeline extends Pipeline {
    /**
     * Extract the features of the input(s).
     *
     * @param {string|string[]} texts The input texts
     * @param {Object} options Additional options:
     * @param {string} [options.pooling="none"] The pooling method to use. Can be one of: "none", "mean".
     * @param {boolean} [options.normalize=false] Whether or not to normalize the embeddings in the last dimension.
     * @returns The features computed by the model.
     */
    _call(texts: string | string[], { pooling, normalize, }?: {
        pooling?: string;
        normalize?: boolean;
    }): Promise<any>;
}
/**
 * Audio classification pipeline using any `AutoModelForAudioClassification`.
 * This pipeline predicts the class of a raw waveform or an audio file.
 *
 * **Example:** Perform audio classification.
 * ```javascript
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
 * let classifier = await pipeline('audio-classification', 'Xenova/wav2vec2-large-xlsr-53-gender-recognition-librispeech');
 * let output = await classifier(url);
 * // [
 * //   { label: 'male', score: 0.9981542229652405 },
 * //   { label: 'female', score: 0.001845747814513743 }
 * // ]
 * ```
 */
export class AudioClassificationPipeline extends Pipeline {
    /**
     * Create a new AudioClassificationPipeline.
     * @param {Object} options An object containing the following properties:
     * @param {string} [options.task] The task of the pipeline. Useful for specifying subtasks.
     * @param {PreTrainedModel} [options.model] The model to use.
     * @param {Processor} [options.processor] The processor to use.
     */
    constructor(options: {
        task?: string;
        model?: PreTrainedModel;
        processor?: Processor;
    });
    /**
     * Preprocesses the input audio for the AutomaticSpeechRecognitionPipeline.
     * @param {any} audio The audio to be preprocessed.
     * @param {number} sampling_rate The sampling rate of the audio.
     * @returns {Promise<Float32Array>} A promise that resolves to the preprocessed audio data.
     * @private
     */
    private _preprocess;
    /**
     * Executes the audio classification task.
     * @param {any} audio The input audio files to be classified.
     * @param {Object} options An optional object containing the following properties:
     * @param {number} [options.topk=5] The number of top predictions to be returned.
     * @returns {Promise<Object[]|Object>} A promise that resolves to an array or object containing the predicted labels and scores.
     */
    _call(audio: any, { topk }?: {
        topk?: number;
    }): Promise<any[] | any>;
}
/**
 * Pipeline that aims at extracting spoken text contained within some audio.
 *
 * **Example:** Transcribe English.
 * ```javascript
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
 * let transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
 * let output = await transcriber(url);
 * // { text: " And so my fellow Americans ask not what your country can do for you, ask what you can do for your country." }
 * ```
 *
 * **Example:** Transcribe English w/ timestamps.
 * ```javascript
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
 * let transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
 * let output = await transcriber(url, { return_timestamps: true });
 * // {
 * //   text: " And so my fellow Americans ask not what your country can do for you, ask what you can do for your country."
 * //   chunks: [
 * //     { timestamp: [0, 8],  text: " And so my fellow Americans ask not what your country can do for you" }
 * //     { timestamp: [8, 11], text: " ask what you can do for your country." }
 * //   ]
 * // }
 * ```
 *
 * **Example:** Transcribe English w/ word-level timestamps.
 * ```javascript
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
 * let transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
 *     revision: 'output_attentions',
 * });
 * let output = await transcriber(url, { return_timestamps: 'word' });
 * // {
 * //   "text": " And so my fellow Americans ask not what your country can do for you ask what you can do for your country.",
 * //   "chunks": [
 * //     { "text": " And", "timestamp": [0, 0.78] },
 * //     { "text": " so", "timestamp": [0.78, 1.06] },
 * //     { "text": " my", "timestamp": [1.06, 1.46] },
 * //     ...
 * //     { "text": " for", "timestamp": [9.72, 9.92] },
 * //     { "text": " your", "timestamp": [9.92, 10.22] },
 * //     { "text": " country.", "timestamp": [10.22, 13.5] }
 * //   ]
 * // }
 * ```
 *
 * **Example:** Transcribe French.
 * ```javascript
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/french-audio.mp3';
 * let transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
 * let output = await transcriber(url, { language: 'french', task: 'transcribe' });
 * // { text: " J'adore, j'aime, je n'aime pas, je déteste." }
 * ```
 *
 * **Example:** Translate French to English.
 * ```javascript
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/french-audio.mp3';
 * let transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
 * let output = await transcriber(url, { language: 'french', task: 'translate' });
 * // { text: " I love, I like, I don't like, I hate." }
 * ```
 *
 * **Example:** Transcribe/translate audio longer than 30 seconds.
 * ```javascript
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/ted_60.wav';
 * let transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
 * let output = await transcriber(url, { chunk_length_s: 30, stride_length_s: 5 });
 * // { text: " So in college, I was a government major, which means [...] So I'd start off light and I'd bump it up" }
 * ```
 */
export class AutomaticSpeechRecognitionPipeline extends Pipeline {
    /**
     * Preprocesses the input audio for the AutomaticSpeechRecognitionPipeline.
     * @param {any} audio The audio to be preprocessed.
     * @param {number} sampling_rate The sampling rate of the audio.
     * @returns {Promise<Float32Array>} A promise that resolves to the preprocessed audio data.
     * @private
     */
    private _preprocess;
    /**
     * @typedef {import('./utils/tensor.js').Tensor} Tensor
     * @typedef {{stride: number[], input_features: Tensor, is_last: boolean, tokens?: number[], token_timestamps?: number[]}} Chunk
     *
     * @callback ChunkCallback
     * @param {Chunk} chunk The chunk to process.
     */
    /**
     * Asynchronously processes audio and generates text transcription using the model.
     * @param {Float32Array|Float32Array[]} audio The audio to be transcribed. Can be a single Float32Array or an array of Float32Arrays.
     * @param {Object} [kwargs={}] Optional arguments.
     * @param {boolean|'word'} [kwargs.return_timestamps] Whether to return timestamps or not. Default is `false`.
     * @param {number} [kwargs.chunk_length_s] The length of audio chunks to process in seconds. Default is 0 (no chunking).
     * @param {number} [kwargs.stride_length_s] The length of overlap between consecutive audio chunks in seconds. If not provided, defaults to `chunk_length_s / 6`.
     * @param {ChunkCallback} [kwargs.chunk_callback] Callback function to be called with each chunk processed.
     * @param {boolean} [kwargs.force_full_sequences] Whether to force outputting full sequences or not. Default is `false`.
     * @param {string} [kwargs.language] The source language. Default is `null`, meaning it should be auto-detected. Use this to potentially improve performance if the source language is known.
     * @param {string} [kwargs.task] The task to perform. Default is `null`, meaning it should be auto-detected.
     * @param {number[][]} [kwargs.forced_decoder_ids] A list of pairs of integers which indicates a mapping from generation indices to token indices
     * that will be forced before sampling. For example, [[1, 123]] means the second generated token will always be a token of index 123.
     * @returns {Promise<Object>} A Promise that resolves to an object containing the transcription text and optionally timestamps if `return_timestamps` is `true`.
     */
    _call(audio: Float32Array | Float32Array[], kwargs?: {
        return_timestamps?: boolean | 'word';
        chunk_length_s?: number;
        stride_length_s?: number;
        chunk_callback?: (chunk: {
            stride: number[];
            input_features: import("./utils/tensor.js").Tensor;
            is_last: boolean;
            tokens?: number[];
            token_timestamps?: number[];
        }) => any;
        force_full_sequences?: boolean;
        language?: string;
        task?: string;
        forced_decoder_ids?: number[][];
    }): Promise<any>;
    /** @private */
    private _call_wav2vec2;
    /** @private */
    private _call_whisper;
}
/**
 * Image To Text pipeline using a `AutoModelForVision2Seq`. This pipeline predicts a caption for a given image.
 *
 * **Example:** Generate a caption for an image w/ `Xenova/vit-gpt2-image-captioning`.
 * ```javascript
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg';
 * let captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
 * let output = await captioner(url);
 * // [{ generated_text: 'a cat laying on a couch with another cat' }]
 * ```
 */
export class ImageToTextPipeline extends Pipeline {
    /**
     * Assign labels to the image(s) passed as inputs.
     * @param {any[]} images The images to be captioned.
     * @param {Object} [generate_kwargs={}] Optional generation arguments.
     * @returns {Promise<Object|Object[]>} A Promise that resolves to an object (or array of objects) containing the generated text(s).
     */
    _call(images: any[], generate_kwargs?: any): Promise<any | any[]>;
}
/**
 * Image classification pipeline using any `AutoModelForImageClassification`.
 * This pipeline predicts the class of an image.
 *
 * **Example:** Classify an image.
 * ```javascript
 * let classifier = await pipeline('image-classification', 'Xenova/vit-base-patch16-224');
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
 * let output = await classifier(url);
 * // [
 * //   {label: 'tiger, Panthera tigris', score: 0.632695734500885},
 * // ]
 * ```
 *
 * **Example:** Classify an image and return top `n` classes.
 * ```javascript
 * let classifier = await pipeline('image-classification', 'Xenova/vit-base-patch16-224');
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
 * let output = await classifier(url, { topk: 3 });
 * // [
 * //   { label: 'tiger, Panthera tigris', score: 0.632695734500885 },
 * //   { label: 'tiger cat', score: 0.3634825646877289 },
 * //   { label: 'lion, king of beasts, Panthera leo', score: 0.00045060308184474707 },
 * // ]
 * ```
 *
 * **Example:** Classify an image and return all classes.
 * ```javascript
 * let classifier = await pipeline('image-classification', 'Xenova/vit-base-patch16-224');
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
 * let output = await classifier(url, { topk: 0 });
 * // [
 * //   {label: 'tiger, Panthera tigris', score: 0.632695734500885},
 * //   {label: 'tiger cat', score: 0.3634825646877289},
 * //   {label: 'lion, king of beasts, Panthera leo', score: 0.00045060308184474707},
 * //   {label: 'jaguar, panther, Panthera onca, Felis onca', score: 0.00035465499968267977},
 * //   ...
 * // ]
 * ```
 */
export class ImageClassificationPipeline extends Pipeline {
    /**
     * Create a new ImageClassificationPipeline.
     * @param {Object} options An object containing the following properties:
     * @param {string} [options.task] The task of the pipeline. Useful for specifying subtasks.
     * @param {PreTrainedModel} [options.model] The model to use.
     * @param {Processor} [options.processor] The processor to use.
     */
    constructor(options: {
        task?: string;
        model?: PreTrainedModel;
        processor?: Processor;
    });
    /**
     * Classify the given images.
     * @param {any} images The images to classify.
     * @param {Object} options The options to use for classification.
     * @param {number} [options.topk=1] The number of top results to return.
     * @returns {Promise<any>} The top classification results for the images.
     */
    _call(images: any, { topk }?: {
        topk?: number;
    }): Promise<any>;
}
/**
 * Image segmentation pipeline using any `AutoModelForXXXSegmentation`.
 * This pipeline predicts masks of objects and their classes.
 *
 * **Example:** Perform image segmentation with `Xenova/detr-resnet-50-panoptic`.
 * ```javascript
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg';
 * let segmenter = await pipeline('image-segmentation', 'Xenova/detr-resnet-50-panoptic');
 * let output = await segmenter(url);
 * // [
 * //   { label: 'remote', score: 0.9984649419784546, mask: RawImage { ... } },
 * //   { label: 'cat', score: 0.9994316101074219, mask: RawImage { ... } }
 * // ]
 * ```
 */
export class ImageSegmentationPipeline extends Pipeline {
    /**
     * Create a new ImageSegmentationPipeline.
     * @param {Object} options An object containing the following properties:
     * @param {string} [options.task] The task of the pipeline. Useful for specifying subtasks.
     * @param {PreTrainedModel} [options.model] The model to use.
     * @param {Processor} [options.processor] The processor to use.
     */
    constructor(options: {
        task?: string;
        model?: PreTrainedModel;
        processor?: Processor;
    });
    subtasks_mapping: {
        panoptic: string;
        instance: string;
        semantic: string;
    };
    /**
     * Segment the input images.
     * @param {Array} images The input images.
     * @param {Object} options The options to use for segmentation.
     * @param {number} [options.threshold=0.5] Probability threshold to filter out predicted masks.
     * @param {number} [options.mask_threshold=0.5] Threshold to use when turning the predicted masks into binary values.
     * @param {number} [options.overlap_mask_area_threshold=0.8] Mask overlap threshold to eliminate small, disconnected segments.
     * @param {null|string} [options.subtask=null] Segmentation task to be performed. One of [`panoptic`, `instance`, and `semantic`], depending on model capabilities. If not set, the pipeline will attempt to resolve (in that order).
     * @param {Array} [options.label_ids_to_fuse=null] List of label ids to fuse. If not set, do not fuse any labels.
     * @param {Array} [options.target_sizes=null] List of target sizes for the input images. If not set, use the original image sizes.
     * @returns {Promise<Array>} The annotated segments.
     */
    _call(images: any[], { threshold, mask_threshold, overlap_mask_area_threshold, label_ids_to_fuse, target_sizes, subtask, }?: {
        threshold?: number;
        mask_threshold?: number;
        overlap_mask_area_threshold?: number;
        subtask?: null | string;
        label_ids_to_fuse?: any[];
        target_sizes?: any[];
    }): Promise<any[]>;
}
/**
 * Zero shot image classification pipeline. This pipeline predicts the class of
 * an image when you provide an image and a set of `candidate_labels`.
 *
 * **Example:** Zero shot image classification w/ `Xenova/clip-vit-base-patch32`.
 * ```javascript
 * let classifier = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32');
 * let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
 * let output = await classifier(url, ['tiger', 'horse', 'dog']);
 * // [
 * //   { score: 0.9993917942047119, label: 'tiger' },
 * //   { score: 0.0003519294841680676, label: 'horse' },
 * //   { score: 0.0002562698791734874, label: 'dog' }
 * // ]
 * ```
 */
export class ZeroShotImageClassificationPipeline extends Pipeline {
    /**
     * Classify the input images with candidate labels using a zero-shot approach.
     * @param {Array} images The input images.
     * @param {string[]} candidate_labels The candidate labels.
     * @param {Object} options The options for the classification.
     * @param {string} [options.hypothesis_template] The hypothesis template to use for zero-shot classification. Default: "This is a photo of {}".
     * @returns {Promise<any>} An array of classifications for each input image or a single classification object if only one input image is provided.
     */
    _call(images: any[], candidate_labels: string[], { hypothesis_template }?: {
        hypothesis_template?: string;
    }): Promise<any>;
}
/**
 * Object detection pipeline using any `AutoModelForObjectDetection`.
 * This pipeline predicts bounding boxes of objects and their classes.
 *
 * **Example:** Run object-detection with `facebook/detr-resnet-50`.
 * ```javascript
 * let img = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg';
 *
 * let detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
 * let output = await detector(img, { threshold: 0.9 });
 * // [{
 * //   "score": 0.9976370930671692,
 * //   "label": "remote",
 * //   "box": { "xmin": 31, "ymin": 68, "xmax": 190, "ymax": 118 }
 * // },
 * // ...
 * // {
 * //   "score": 0.9984092116355896,
 * //   "label": "cat",
 * //   "box": { "xmin": 331, "ymin": 19, "xmax": 649, "ymax": 371 }
 * // }]
 * ```
 */
export class ObjectDetectionPipeline extends Pipeline {
    /**
     * Create a new ObjectDetectionPipeline.
     * @param {Object} options An object containing the following properties:
     * @param {string} [options.task] The task of the pipeline. Useful for specifying subtasks.
     * @param {PreTrainedModel} [options.model] The model to use.
     * @param {Processor} [options.processor] The processor to use.
     */
    constructor(options: {
        task?: string;
        model?: PreTrainedModel;
        processor?: Processor;
    });
    /**
     * Detect objects (bounding boxes & classes) in the image(s) passed as inputs.
     * @param {any[]} images The input images.
     * @param {Object} options The options for the object detection.
     * @param {number} [options.threshold=0.9] The threshold used to filter boxes by score.
     * @param {boolean} [options.percentage=false] Whether to return the boxes coordinates in percentage (true) or in pixels (false).
     */
    _call(images: any[], { threshold, percentage, }?: {
        threshold?: number;
        percentage?: boolean;
    }): Promise<any>;
    /**
     * Helper function to convert list [xmin, xmax, ymin, ymax] into object { "xmin": xmin, ... }
     * @param {number[]} box The bounding box as a list.
     * @param {boolean} asInteger Whether to cast to integers.
     * @returns {Object} The bounding box as an object.
     * @private
     */
    private _get_bounding_box;
}
export type PretrainedOptions = import('./utils/hub.js').PretrainedOptions;
export type QuestionAnsweringResult = {
    /**
     * - The answer.
     */
    answer: string;
    /**
     * - The score.
     */
    score: number;
};
export type QuestionAnsweringReturnType = Promise<QuestionAnsweringResult | QuestionAnsweringResult[]>;
import { PreTrainedModel } from './models.js';
import { PreTrainedTokenizer } from './tokenizers.js';
import { Processor } from './processors.js';
export {};
//# sourceMappingURL=pipelines.d.ts.map