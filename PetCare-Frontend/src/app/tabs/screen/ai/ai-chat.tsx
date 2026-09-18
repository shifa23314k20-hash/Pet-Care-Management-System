import React, {
    useRef,
    useState,
} from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    SafeAreaView,
    Keyboard,
} from 'react-native';

import {
    Sparkles,
    ArrowLeft,
    Send,
    Trash2,
} from 'lucide-react-native';

import { router } from 'expo-router';
import { chatWithAI } from '@/services/ai';



// =========================
// MESSAGE TYPE
// =========================

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
};


// =========================
// PETPAL CHAT SCREEN
// =========================

export default function AIChatScreen() {

    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',

            text:
                "Hi! I'm PetPal 👋\n\nHow can I help you with your pet today?",

            sender: 'ai',
        },
    ]);

    const flatListRef =
        useRef<FlatList>(null);


    // =========================
    // SEND MESSAGE
    // =========================

    const sendMessage = async () => {

        const trimmedMessage =
            message.trim();


        // Don't send empty messages
        if (!trimmedMessage || loading) {
            return;
        }


        Keyboard.dismiss();


        // =========================
        // USER MESSAGE
        // =========================

        const userMessage: Message = {
            id: Date.now().toString(),

            text: trimmedMessage,

            sender: 'user',
        };


        setMessages((prev) => [
            ...prev,
            userMessage,
        ]);


        setMessage('');

        setLoading(true);


        try {

            // =========================
            // CALL YOUR EXISTING SERVICE
            // =========================

            const response =
                await chatWithAI({
                    message: trimmedMessage,
                });


            // =========================
            // AI RESPONSE
            // =========================

            if (
                response?.success &&
                response?.reply
            ) {

                const aiMessage: Message = {
                    id: `${Date.now()}-ai`,

                    text: response.reply,

                    sender: 'ai',
                };


                setMessages((prev) => [
                    ...prev,
                    aiMessage,
                ]);

            } else {

                throw new Error(
                    response?.message ||
                    'Failed to get AI response'
                );
            }

        } catch (error) {

            console.error(
                'PETPAL CHAT ERROR:',
                error
            );


            // =========================
            // ERROR MESSAGE
            // =========================

            const errorMessage: Message = {
                id: `${Date.now()}-error`,

                text:
                    "I'm sorry, I couldn't process that right now. Please try again.",

                sender: 'ai',
            };


            setMessages((prev) => [
                ...prev,
                errorMessage,
            ]);

        } finally {

            setLoading(false);


            // Scroll to bottom
            setTimeout(() => {

                flatListRef.current?.scrollToEnd({
                    animated: true,
                });

            }, 100);
        }
    };


    // =========================
    // CLEAR CHAT
    // =========================

    const clearChat = () => {

        setMessages([
            {
                id: '1',

                text:
                    "Hi! I'm PetPal 👋\n\nHow can I help you with your pet today?",

                sender: 'ai',
            },
        ]);
    };


    // =========================
    // RENDER MESSAGE
    // =========================

    const renderMessage = ({
        item,
    }: {
        item: Message;
    }) => {

        const isUser =
            item.sender === 'user';


        return (
            <View
                style={[
                    styles.messageRow,

                    isUser &&
                    styles.userMessageRow,
                ]}
            >

                {/* AI ICON */}
                {!isUser && (
                    <View
                        style={
                            styles.smallAIIcon
                        }
                    >
                        <Sparkles
                            size={16}
                            color="#6C5DD3"
                            strokeWidth={2.2}
                        />
                    </View>
                )}


                {/* MESSAGE BUBBLE */}

                <View
                    style={[
                        styles.messageBubble,

                        isUser
                            ? styles.userBubble
                            : styles.aiBubble,
                    ]}
                >

                    <Text
                        style={[
                            styles.messageText,

                            isUser
                                ? styles.userMessageText
                                : styles.aiMessageText,
                        ]}
                    >
                        {item.text}
                    </Text>

                </View>

            </View>
        );
    };


    // =========================
    // SCREEN
    // =========================

    return (
        <SafeAreaView
            style={styles.container}
        >

            <KeyboardAvoidingView
                style={styles.keyboardContainer}

                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : 'height'
                }
            >

                {/* =========================
                    HEADER
                ========================= */}

                <View
                    style={styles.header}
                >

                    {/* BACK BUTTON */}

                    <TouchableOpacity
                        style={styles.backButton}

                        onPress={() =>
                            router.back()
                        }

                        activeOpacity={0.7}
                    >

                        <ArrowLeft
                            size={23}
                            color="#252525"
                        />

                    </TouchableOpacity>


                    {/* PETPAL INFO */}

                    <View
                        style={styles.headerCenter}
                    >

                        <View
                            style={
                                styles.headerAIIcon
                            }
                        >

                            <Sparkles
                                size={20}
                                color="#FFFFFF"
                                strokeWidth={2.2}
                            />

                        </View>


                        <View>

                            <Text
                                style={
                                    styles.headerTitle
                                }
                            >
                                PetPal
                            </Text>


                            <Text
                                style={
                                    styles.headerSubtitle
                                }
                            >
                                AI Pet Care
                            </Text>

                        </View>

                    </View>


                    {/* CLEAR CHAT */}

                    <TouchableOpacity
                        style={
                            styles.clearButton
                        }

                        onPress={clearChat}

                        activeOpacity={0.7}
                    >

                        <Trash2
                            size={21}
                            color="#85858F"
                        />

                    </TouchableOpacity>

                </View>


                {/* =========================
                    CHAT AREA
                ========================= */}

                <FlatList
                    ref={flatListRef}

                    data={messages}

                    keyExtractor={(item) =>
                        item.id
                    }

                    renderItem={renderMessage}

                    showsVerticalScrollIndicator={
                        false
                    }

                    contentContainerStyle={
                        styles.chatContent
                    }

                    keyboardShouldPersistTaps="handled"

                    onContentSizeChange={() => {

                        flatListRef.current?.scrollToEnd({
                            animated: true,
                        });

                    }}

                    ListFooterComponent={

                        loading ? (

                            <View
                                style={
                                    styles.loadingRow
                                }
                            >

                                <View
                                    style={
                                        styles.smallAIIcon
                                    }
                                >

                                    <Sparkles
                                        size={16}
                                        color="#6C5DD3"
                                        strokeWidth={2.2}
                                    />

                                </View>


                                <View
                                    style={
                                        styles.loadingBubble
                                    }
                                >

                                    <ActivityIndicator
                                        size="small"
                                        color="#6C5DD3"
                                    />


                                    <Text
                                        style={
                                            styles.loadingText
                                        }
                                    >
                                        PetPal is thinking...
                                    </Text>

                                </View>

                            </View>

                        ) : null
                    }
                />


                {/* =========================
    DISCLAIMER + CHAT NOTE
========================= */}

                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>
                        PetPal provides general information and does not replace
                        professional veterinary advice.
                    </Text>

                    <Text style={styles.chatNote}>
                        💡 Chat history is not saved. Chats disappear when you leave this page.
                    </Text>
                </View>


                {/* =========================
                    MESSAGE INPUT
                ========================= */}

                <View
                    style={styles.inputArea}
                >

                    <View
                        style={
                            styles.inputContainer
                        }
                    >

                        <TextInput
                            value={message}

                            onChangeText={
                                setMessage
                            }

                            placeholder="Ask PetPal anything..."

                            placeholderTextColor="#A0A0AA"

                            multiline

                            maxLength={1000}

                            style={
                                styles.textInput
                            }

                            editable={!loading}

                            textAlignVertical="center"

                            returnKeyType="send"

                            blurOnSubmit={false}

                            onSubmitEditing={
                                sendMessage
                            }
                        />


                        {/* SEND BUTTON */}

                        <TouchableOpacity
                            style={[
                                styles.sendButton,

                                (
                                    !message.trim() ||
                                    loading
                                ) &&
                                styles.sendButtonDisabled,
                            ]}

                            onPress={
                                sendMessage
                            }

                            disabled={
                                !message.trim() ||
                                loading
                            }

                            activeOpacity={0.8}
                        >

                            {loading ? (

                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />

                            ) : (

                                <Send
                                    size={20}
                                    color="#FFFFFF"
                                    strokeWidth={2.2}
                                />

                            )}

                        </TouchableOpacity>

                    </View>

                </View>

            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

    // =========================
    // SCREEN
    // =========================

    container: {
        flex: 1,

        backgroundColor: '#F9F8FF',
    },

    keyboardContainer: {
        flex: 1,
    },


    // =========================
    // HEADER
    // =========================

    header: {
        height: 70,

        backgroundColor: '#FFFFFF',

        borderBottomWidth: 1,

        borderBottomColor: '#F0F0F4',

        flexDirection: 'row',

        alignItems: 'center',

        paddingHorizontal: 16,
    },

    chatNote: {
        fontSize: 10,
        lineHeight: 14,
        color: '#6C5DD3',
        textAlign: 'center',
        marginTop: 4,
    },

    backButton: {
        width: 42,

        height: 42,

        borderRadius: 21,

        backgroundColor: '#F5F4FA',

        alignItems: 'center',

        justifyContent: 'center',
    },


    headerCenter: {
        flex: 1,

        flexDirection: 'row',

        alignItems: 'center',

        marginLeft: 12,
    },


    headerAIIcon: {
        width: 40,

        height: 40,

        borderRadius: 20,

        backgroundColor: '#6C5DD3',

        alignItems: 'center',

        justifyContent: 'center',

        marginRight: 10,
    },


    headerTitle: {
        fontSize: 18,

        fontWeight: '700',

        color: '#252525',
    },


    headerSubtitle: {
        fontSize: 11,

        color: '#85858F',

        marginTop: 2,
    },


    clearButton: {
        width: 42,

        height: 42,

        borderRadius: 21,

        alignItems: 'center',

        justifyContent: 'center',
    },


    // =========================
    // CHAT
    // =========================

    chatContent: {
        paddingHorizontal: 16,

        paddingTop: 20,

        paddingBottom: 15,

        flexGrow: 1,
    },


    messageRow: {
        flexDirection: 'row',

        alignItems: 'flex-end',

        marginBottom: 16,

        paddingRight: 35,
    },


    userMessageRow: {
        justifyContent: 'flex-end',

        paddingRight: 0,

        paddingLeft: 35,
    },


    smallAIIcon: {
        width: 30,

        height: 30,

        borderRadius: 15,

        backgroundColor: '#F0EDFF',

        alignItems: 'center',

        justifyContent: 'center',

        marginRight: 8,
    },


    messageBubble: {
        maxWidth: '82%',

        paddingHorizontal: 15,

        paddingVertical: 12,

        borderRadius: 18,
    },


    aiBubble: {
        backgroundColor: '#FFFFFF',

        borderBottomLeftRadius: 5,

        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 1,
        },

        shadowOpacity: 0.04,

        shadowRadius: 3,

        elevation: 1,
    },


    userBubble: {
        backgroundColor: '#6C5DD3',

        borderBottomRightRadius: 5,
    },


    messageText: {
        fontSize: 14,

        lineHeight: 21,
    },


    aiMessageText: {
        color: '#35353D',
    },


    userMessageText: {
        color: '#FFFFFF',
    },


    // =========================
    // LOADING
    // =========================

    loadingRow: {
        flexDirection: 'row',

        alignItems: 'center',

        marginBottom: 15,
    },


    loadingBubble: {
        flexDirection: 'row',

        alignItems: 'center',

        backgroundColor: '#FFFFFF',

        paddingHorizontal: 14,

        paddingVertical: 11,

        borderRadius: 17,

        borderBottomLeftRadius: 5,
    },


    loadingText: {
        fontSize: 12,

        color: '#85858F',

        marginLeft: 8,
    },


    // =========================
    // DISCLAIMER
    // =========================

    disclaimer: {
        paddingHorizontal: 20,

        paddingVertical: 7,

        backgroundColor: '#F9F8FF',

        alignItems: 'center',
    },


    disclaimerText: {
        fontSize: 10,

        lineHeight: 14,

        color: '#9999A3',

        textAlign: 'center',
    },


    // =========================
    // INPUT
    // =========================

    inputArea: {
        backgroundColor: '#FFFFFF',

        borderTopWidth: 1,

        borderTopColor: '#F0F0F4',

        paddingHorizontal: 14,

        paddingTop: 10,

        paddingBottom:
            Platform.OS === 'ios'
                ? 10
                : 12,
    },


    inputContainer: {
        minHeight: 52,

        maxHeight: 120,

        borderRadius: 26,

        backgroundColor: '#F5F4FA',

        flexDirection: 'row',

        alignItems: 'flex-end',

        paddingLeft: 17,

        paddingRight: 7,

        paddingVertical: 6,
    },


    textInput: {
        flex: 1,

        fontSize: 14,

        color: '#292929',

        maxHeight: 100,

        minHeight: 40,

        paddingTop: 8,

        paddingBottom: 8,

        paddingRight: 10,
    },


    sendButton: {
        width: 40,

        height: 40,

        borderRadius: 20,

        backgroundColor: '#6C5DD3',

        alignItems: 'center',

        justifyContent: 'center',
    },


    sendButtonDisabled: {
        opacity: 0.45,
    },
});