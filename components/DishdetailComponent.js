import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Button, Modal, StyleSheet } from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { baseUrl } from '../shared/baseUrl';
import { connect } from 'react-redux';
import { postFavorite, addComment, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
} 

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    addComment:(comment) =>dispatch(addComment(comment)),
    postComment:(dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))

});


function RenderDish(props) {
    const dish = props.dish;

    if (dish != null) {
        return (
            <Card 
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image}}
                >
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o' }
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                <Icon
                    raised
                    reverse
                    name={'pencil'}
                    type='font-awesome'
                    color='#512DA8'
                    onPress={() => props.onSelect()}
                    />          
            </Card>
        );
    }
    else {
        return(<View></View>)
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        const  rating = item.rating;
        return(
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating imageSize={13} readonly startingValue={rating} style={styles.rating}/>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }

    return(
        <Card title="Comments" >
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
        </Card>
    );
}

class Dishdetail extends Component {


    constructor(props) {
        super(props);

        this.state = {
            rating: 0,
            author: '',
            comment: '',
            showModal: false
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };
    
    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleComments(dishId) {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
    }

    render(){

        const dishId = this.props.navigation.getParam('dishId','');

        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onSelect = {() => this.toggleModal()}
                    /> 
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)}/>
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}
                    >
                    <View style={styles.modal}>
                        <View>
                            <Rating
                                type='star'
                                ratingCount={5}
                                fractions={0}
                                startingValue={0}
                                onFinishRating={rating => this.setState({ rating: rating })}
                                imageSize={30}
                                showRating
                                />
                        </View>
                        
                        <View style={styles.modalText}>
                            <Input 
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o', marginRight: 10}}
                            onChangeText = {author => this.setState({author: author})}
                            />
                        </View>
                        
                        <View style={styles.modalText}>
                            <Input
                                placeholder='Comment'
                                leftIcon={{ type: 'font-awesome', name: 'comment-o', marginRight: 10}}
                                onChangeText = {comment => this.setState({comment: comment})}
                                />
                        </View>
                        
                        <View style={styles.modalText}>
                            <Button
                                title='SUBMIT'
                                color='#512DA8'
                                onPress = {() => this.handleComments(dishId)}
                                />
                        </View>
                        
                        <View style={styles.modalText}>
                            <Button
                                title='CANCEL'
                                color='#989898'
                                onPress={() => this.toggleModal()}
                                />
                        </View>
                        
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 28
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    },
    rating: {
        alignItems: 'flex-start',
        //flex: 1
    }
});



export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);