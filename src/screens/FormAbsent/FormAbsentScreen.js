import React from 'react';
import { ScrollView, View, ActivityIndicator, Alert } from 'react-native';
import { Card, ListItem, Header, Text, Badge, Button, Input, Image, Overlay, CheckBox } from 'react-native-elements';
import { submitAbsentParent, getHomeParent } from '../../actions/parent';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataTable from 'react-native-paper/lib/commonjs/components/DataTable/DataTable';
import DataTableHeader from 'react-native-paper/lib/commonjs/components/DataTable/DataTableHeader';
import DataTableTitle from 'react-native-paper/lib/commonjs/components/DataTable/DataTableTitle';
import DataTableRow from 'react-native-paper/lib/commonjs/components/DataTable/DataTableRow';
import DataTableCell from 'react-native-paper/lib/commonjs/components/DataTable/DataTableCell';
import EmptyText from '../../components/EmptyText';
import moment from 'moment';
import _ from 'lodash';

class FormAbsentScreen extends React.Component {

    state = {
        reasons: 'sakit',
        description: "",
        image: null,
        isOverlay: false,
        checked: [],
        imageInformation: null
    }

    componentDidMount = () => {
        this.startingHomeData()
        this.setChecked()
    }

    startingHomeData = async () => {
        const { actions } = this.props;
        await actions.getHomeParent();
    }

    setChecked = () => {
        const { home } = this.props;
        const { absenToday } = home;
        const checked = absenToday.map(val => true);
        this.setState({
            checked
        })
    }

    getColorBadge = (status) => {
        if (status == 'hadir') {
            return 'success';
        }
        if (status == 'sedang berjalan') {
            return 'primary';
        }
        if (status == 'belum di mulai') {
            return 'primary';
        }
        return 'warning';
    }

    setReasons = (reasons) => {
        this.setState({
            reasons: reasons
        })
    }

    setDescription = (description) => {
        console.log(description);
        this.setState({
            description: description
        })
    }

    getPhoto = () => {
        ImagePicker.openPicker({
            cropping: true
        }).then(image => {
            this.setState({
                image: image.path,
                imageInformation: image
            })
        }).catch(error => {
        })
    }

    getPhotoByCamera = () => {
        ImagePicker.openCamera({
            cropping: true,
            freeStyleCropEnabled: true,
        }).then(image => {
            this.setState({
                image: image.path,
                imageInformation: image
            })
        }).catch(error => {
        })
    }

    deletePhoto = () => {
        this.setState({
            image: null,
            imageInformation: null
        })
    }

    setOverlay = () => {
        const { isOverlay } = this.state;
        this.setState({
            isOverlay: !isOverlay
        })
    }

    submitAbsent = async () => {

        const { actions, navigation } = this.props;
        const { reasons, imageInformation, description } = this.state;

        // const date = new Date();
        const date = moment(new Date()).format('X');
        const data = new FormData();

        data.append('date', date);
        data.append('reasons', reasons);
        data.append('description', description);

        if (imageInformation) {
            data.append('foto', {
                uri: Platform.OS === 'ios' ?
                    `file:///${imageInformation.path}` : imageInformation.path,
                type: imageInformation.mime,
                name: 'photo_absention'
            })
        }
        this.setOverlay()
        await actions.submitAbsentParent(data).then(async (result) => {
            if (result) {
                const { data } = result;
                const { status, message } = data;
                if (status == 'error') {
                    setTimeout(() => {
                        this.setOverlay()
                        Alert.alert('Error', message)
                    }, 1000)
                } else {
                    this.setOverlay()
                    await actions.getHomeParent();
                    setTimeout(() => {
                        // navigation.navigate('HomeParentScreen')
                    }, 500);
                }
            }
        });
    }

    returnBadge = (data) => {
        return (<Badge
            badgeStyle={{ padding: 13 }}
            status={this.getColorBadge(data.absenteeism)}
            value={<Text style={{ fontSize: 13, color: 'white' }}>
                {data.absenteeism}
            </Text>}
        />);
    }

    render() {
        const { reasons, image, isOverlay, checked } = this.state;
        const { home } = this.props;
        const { absenToday } = home;
        console.log('check', checked);
        return (
            <>
                <Header
                    containerStyle={{ backgroundColor: '#3b5998' }}
                    centerComponent={{
                        text: 'FORM ABSENSI',
                        style: { fontSize: 20, fontWeight: 'bold', color: '#fff' }
                    }}
                />
                <Overlay isVisible={isOverlay}>
                    <Text>Mohon Tunggu...</Text>
                </Overlay>
                <ScrollView style={
                    {
                        height: '100%',
                        padding: 5,
                        backgroundColor: '#f0f0f0'
                    }}
                >
                    <View style={{ marginBottom: 50 }}>
                        <Card containerStyle={{ padding: 0, paddingTop: 10 }}>
                            <Card.Title style={{ fontSize: 20, fontWeight: '500' }}>
                                MATA PELAJARAN
                                </Card.Title>
                            <Card.Divider />
                            <Card.FeaturedSubtitle style={{
                                color: 'grey', paddingHorizontal: 25,
                                fontWeight: '500', textAlign: 'center'
                            }}>
                                Pilih/Centang mata pelajaran yang ingin anda ajukan untuk izin
                                </Card.FeaturedSubtitle>

                            {
                                !_.isEmpty(absenToday) ? (absenToday.map((l, i) => (
                                    <ListItem key={i} bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title style={{ color: '#000', paddingLeft: 35 }}>
                                                <Text style={{ fontSize: 16 }}>
                                                    {l.subject.name}
                                                </Text>
                                            </ListItem.Title>
                                            <View flexDirection="row" style={{ marginLeft: -10 }}>
                                                <CheckBox containerStyle={{ padding: 0, justifyContent: 'center' }} />
                                                <DataTable style={{ marginLeft: -15 }}>
                                                    <DataTableHeader style={{ borderBottomColor: 'white' }}>
                                                        <DataTableTitle numberOfLines={20}>Status</DataTableTitle>
                                                        <DataTableTitle>Jam mulai - selesai</DataTableTitle>
                                                    </DataTableHeader>
                                                    <DataTableRow style={{ borderBottomColor: 'white' }}>
                                                        <DataTableCell>
                                                            {this.returnBadge(l)}
                                                        </DataTableCell>
                                                        <DataTableCell>{l.start_at.slice(0, -3)} - {l.end_at.slice(0, -3)}</DataTableCell>
                                                    </DataTableRow>
                                                </DataTable>
                                            </View>
                                        </ListItem.Content>
                                    </ListItem>
                                ))) : (<EmptyText />)
                            }
                        </Card>
                        <Card>
                            <View style={{
                                borderRadius: 20,
                                borderWidth: 1,
                                paddingVertical: 10,
                                borderColor: 'rgba(110, 120, 170, 1)',
                                marginBottom: 10,
                            }}>
                                <Picker
                                    selectedValue={reasons}
                                    style={{
                                        height: 45,
                                        width: '100%'
                                    }}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setReasons(itemValue)
                                    }}>
                                    {/* <Picker.Item label="absen" value="absen" /> */}
                                    <Picker.Item label="izin" value="izin" />
                                    <Picker.Item label="sakit" value="sakit" />
                                    <Picker.Item label="lainnya" value="lainnya" />
                                </Picker>
                            </View>
                            {
                                !image ? (
                                    <View style={{
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        height: 300,
                                        borderColor: 'rgba(110, 120, 170, 1)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginVertical: 20
                                    }}>
                                        <Text style={{ fontSize: 20, color: 'rgba(110, 120, 170, 1)', }}>
                                            No Image
                                        </Text>
                                    </View>
                                ) : null
                            }
                            {
                                image ? (<Image
                                    source={{ uri: image }}
                                    style={{ height: 500, marginVertical: 10 }}
                                    PlaceholderContent={<ActivityIndicator />}
                                />) : (<></>)
                            }
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                                {
                                    image ? (<Button title="Hapus" onPress={this.deletePhoto} />) : null
                                }

                                <Button title="Buka galeri" onPress={this.getPhoto} />
                                <Button title="Ambil foto" onPress={this.getPhotoByCamera} />
                            </View>
                            <Input
                                placeholder='Deskripsi'
                                onChangeText={this.setDescription}
                                multiline={true}
                                numberOfLines={5}
                            />
                            <Button
                                containerStyle={{ marginTop: 20 }}
                                onPress={() => this.submitAbsent()}
                                title="AJUKAN" />
                        </Card>
                    </View>
                </ScrollView>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    home: _.get(state.parent, 'home'),
    user: _.get(state.session, 'user'),
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            submitAbsentParent,
            getHomeParent
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormAbsentScreen);


