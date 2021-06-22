import React from 'react';
import MoreLessComponent from './MoreLessComponent';
import {Text} from "react-native";

const MoreLessText = ({text, linesToTruncate}) => {
    const [clippedText, setClippedText] = React.useState(false);
    return clippedText ? (
        <MoreLessComponent truncatedText={clippedText} fullText={text} />
    ) : (
        <Text
            numberOfLines={linesToTruncate}
            ellipsizeMode={'tail'}
            onTextLayout={(event) => {
                //get all lines
                const { lines } = event.nativeEvent;
                //get lines after it truncate
                console.log('lines', lines);
                let text = lines
                    .splice(0, linesToTruncate)
                    .map((line) => line.text)
                    .join('');
                //substring with some random digit, this might need more work here based on the font size
                //
                if(lines.length > linesToTruncate){
                    setClippedText(text.substr(0, text.length - 9));
                }
            }}>
            {text}
        </Text>
    );
};


export default MoreLessText;
