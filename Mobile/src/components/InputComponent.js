import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image} from 'react-native';
import normalize from 'react-native-normalize';
import Colors from "../constants/Colors";

export default class InputComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            secureTextEntry: false
        }
    }

    componentWillMount() {
        const { secureTextEntry } = this.props
        this.setState({
            secureTextEntry
        })
    }

    render() {
        let bgColor=this.props.bgColor || Colors.greyWeakColor;
        let textColor=this.props.textColor || '#000000';
        let placeholderTextColor = this.props.placeholderTextColor || Colors.greyColor;
        let inputHeight=this.props.inputHeight || normalize(45, 'height');
        let inputWidth=this.props.inputWidth || '100%';
        let inputRadius=this.props.inputRadius || normalize(8);
        let inputPaddingLeft=this.props.inputPaddingLeft || normalize(10);
        let secureTextEntry = this.state.secureTextEntry;
        return(


            <View style={[styles.containerView,{backgroundColor: bgColor ,width:inputWidth, height:inputHeight,borderRadius: inputRadius}]}>
                <TextInput
                    secureTextEntry={secureTextEntry}
                    style={[styles.textInput,{paddingLeft:inputPaddingLeft}, {color : textColor}]}
                    placeholderTextColor={placeholderTextColor}
                    keyboardType={this.props.keyboardType}
                    value={this.props.value}
                    onChangeText={this.props.onChangeText}
                    autoCapitalize={this.props.autoCapitalize??'sentences'}
                />
                {!this.props.value && <Text style={[styles.placeholder, { color: placeholderTextColor, paddingLeft:inputPaddingLeft }]}>
                    {this.props.placeholder}<Text style={styles.asterisk}>*</Text>
                </Text>}
            </View>



        );
    }
}

const styles= StyleSheet.create({
    containerView: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between',
        height: normalize(45, 'height'),
        width:'100%',
        borderRadius:normalize(8),
        backgroundColor: Colors.greyWeakColor,
        marginTop: normalize(10, 'height')
        // borderBottomWidth:2,
        // borderColor:'red',
        // borderWidth:wp(0.1),
        // paddingBottom:wp(2)
    },
    textInput: {
        flex:1,
        backgroundColor: Colors.greyWeakColor,
        borderRadius:normalize(8),
        // paddingLeft:wp(2),
    },
    text: {
        fontSize: 12,
        // fontWeight:'700',
        color: '#fff',
        textAlign:'center',
        // fontFamily:'Proxima_Nova_Semibold'
    },
    placeholder: {
        position: 'absolute'
    },
    asterisk: {
        color: Colors.riskColor
    }


});


