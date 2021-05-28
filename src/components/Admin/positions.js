import React, { Component, useState, useEffect } from 'react';
import {
  Box, Text, Button, Icon, PseudoBox, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Skeleton,
} from '@chakra-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import firebase from 'gatsby-plugin-firebase';
import Layout from '../Layout';
import { IsMobile, IsDesktop } from '../../utils/mediaQueries';

const Header = ({
  title, description, addPosition, loading,
}) => (
  <Box
    mt={IsMobile() ? '46px' : '12px'}
    h={IsDesktop() ? '76px' : '160px'}
    display="flex"
    flexDirection="row"
    justifyContent={IsDesktop() ? 'space-between' : ''}
    alignItems="center"
    mb={IsDesktop() ? '4px' : '16px'}
    flexWrap="wrap"
  >
    <Box>
      <Text fontSize="2xl" fontWeight="bold" color="blueGray.900">
        {title}
      </Text>
      <Text
        fontSize="16px"
        fontWeight="600"
        color="blueGray.500"
      >
        {description}
      </Text>
    </Box>
    <Button
      borderRadius="8px"
      px="18px"
      py="12px"
      fontSize="14px"
      fontWeight="600"
      variantColor="blue"
      onClick={addPosition}
      isLoading={loading}
    >
      Add Position
    </Button>
  </Box>
);

const reorderPositions = (positionList, startIndex, endIndex) => {
  const list = Array.from(positionList);
  const [removed] = list.splice(startIndex, 1);
  list.splice(endIndex, 0, removed);

  firebase.firestore().collection('election').doc('positions').update({
    order: list,
  });

  return list;
};

const PositionCard = ({ item, index, onDelete }) => (
  <Draggable key={item} draggableId={item} index={index}>
    {(provided, snapshot) => (
      <Box
        ref={provided.innerRef}
                    // eslint-disable-next-line react/jsx-props-no-spreading
        {...provided.draggableProps}
                    // eslint-disable-next-line react/jsx-props-no-spreading
        {...provided.dragHandleProps}
        height="60px"
        backgroundColor="white"
        border="2px solid rgba(217, 226, 236, 0.6)"
        display="flex"
        flexDirection="row"
        alignItems="center"
        px="24px"
        fontSize="16px"
        fontWeight="600"
        color="blue.900"
        textTransform="capitalize"
        mb="16px"
        borderRadius="12px"
      >
        <Icon name="drag-handle" color="blue.900" mr="16px" />
        {item.replaceAll('-', ' ')}
        <PseudoBox as="button" onClick={() => onDelete(index)} ml="auto">
          <Icon size="20px" mt="-2px" name="trash" />
        </PseudoBox>
      </Box>
    )}
  </Draggable>
);

const AddPositionModal = ({ toggleModal, addPosition, isOpen }) => {
  const [positionVal, setPositionVal] = useState('');
  const handleChange = (event) => setPositionVal(event.target.value);

  useEffect(() => {
    setPositionVal('');
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={toggleModal}>
      <ModalOverlay />
      <ModalContent borderRadius="12px">
        <ModalHeader>Add Position</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel fontSize="16px" fontWeight="600" color="blue.900" mb="4px">
              Position
            </FormLabel>
            <Input
              color="blueGray.700"
              borderRadius="6px"
              borderColor="#D9E2EC"
              fontWeight="600"
              placeholder="Position"
              value={positionVal}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button borderRadius="8px" mr="16px" onClick={toggleModal}>
            Cancel
          </Button>
          <Button variantColor="teal" borderRadius="8px" onClick={() => addPosition(positionVal)}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const SkeletonCard = () => (
  <Skeleton mb="16px" width={IsDesktop() ? '400px' : '100%'} borderRadius="12px" height="60px" />
);

export default class Positions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positions: [],
      positionsLoading: true,
      modalOpen: false,
    };
  }

  componentDidMount() {
    this.getPositions();
  }

  getPositions = async () => {
    const positionsRef = await firebase.firestore().collection('election').doc('positions').get();
    const positions = positionsRef.data().order;
    this.setState({
      positions,
      positionsLoading: false,
    });
  }

  onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const positions = reorderPositions(
      this.state.positions,
      result.source.index,
      result.destination.index,
    );

    this.setState({
      positions,
    });
  }

  deletePosition = async (index) => {
    const parsedPosition = this.state.positions[index].replace(' ', '-').toLowerCase();
    try {
      const batch = firebase.firestore().batch();

      const positionOrderRef = firebase.firestore().collection('election').doc('positions');
      batch.update(positionOrderRef, {
        order: firebase.firestore.FieldValue.arrayRemove(this.state.positions[index]),
      });

      const positionsRef = firebase.firestore().collection('positions').doc(parsedPosition);
      batch.delete(positionsRef);

      const candidatesInPositionRef = await firebase.firestore().collection('candidates').where('position', '==', positionsRef).get();
      candidatesInPositionRef.forEach((candidate) => batch.delete(candidate.ref));

      batch.commit().then(() => {
        const updatedPositions = this.state.positions;
        delete updatedPositions[index];
        this.setState({ positions: updatedPositions });
      });
    } catch (err) {
      console.log(err);
    }
  }

  addPosition = async (position) => {
    const updatedPositions = this.state.positions;
    const parsedPosition = position.replaceAll(' ', '-').toLowerCase();
    updatedPositions.push(parsedPosition);
    try {
      const batch = firebase.firestore().batch();

      const positionOrderRef = firebase.firestore().collection('election').doc('positions');
      batch.update(positionOrderRef, { order: updatedPositions });

      const positionsRef = firebase.firestore().collection('positions').doc(parsedPosition);
      batch.set(positionsRef, {
        name: parsedPosition.replaceAll('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      });

      batch.commit().then(() => {
        this.setState({
          positions: updatedPositions,
          modalOpen: false,
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      modalOpen: !prevState.modalOpen,
    }));
  }

  render() {
    return (
      <>
        <Layout>
          <Header loading={this.state.positionsLoading} title="Positions" description="Change the order that positions are displayed in by dragging them." addPosition={this.toggleModal} />
          {this.state.positionsLoading
            ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            )
            : (
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <Box
                // eslint-disable-next-line react/jsx-props-no-spreading
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      width={IsDesktop() ? '400px' : '100%'}
                    >
                      {this.state.positions.map((item, index) => (
                        <PositionCard item={item} index={index} onDelete={this.deletePosition} />
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            )}
        </Layout>
        <AddPositionModal isOpen={this.state.modalOpen} toggleModal={this.toggleModal} addPosition={this.addPosition} />
      </>
    );
  }
}
