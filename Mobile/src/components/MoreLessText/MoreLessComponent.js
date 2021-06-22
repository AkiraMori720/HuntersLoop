import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Colors from "../../constants/Colors";

const MoreLessComponent = ({ truncatedText, fullText }) => {
    const [more, setMore] = React.useState(false);
    return (
        <View>
            <Text>{!more ? `${truncatedText}...` : fullText}</Text>
            <TouchableOpacity onPress={() => setMore(!more)}>
                <Text style={{color: Colors.readMoreLessColor, marginTop: 5, marginRight: 5, textAlign: 'right', textDecorationLine: 'underline', fontStyle: 'italic'}} >{more ? 'Read less' : 'Read more'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MoreLessComponent;
