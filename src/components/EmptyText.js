import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { StyleSheet } from 'react-native';

const EmptyText = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.textStyle}>(Kosong)</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    textStyle: { fontSize: 17, color: '#b6c4e2' },
    container: { alignItems: 'center' },
});

export default EmptyText;