import {
  Button,
  Input,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerHeader,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
} from '@chakra-ui/core';
import { NeutralButton } from './settings';
import React from 'react';
import { genKeys } from '../../utils/keygen';
import { useState } from 'react';

class KeygenUI extends React.Component {
  // const btnRef = useRef();

  handleStepChange = step => {
    this.setState({
      step,
    });
  };

  handleKeysChange = keys => {
    this.setState({
      keys,
    });
  };

  switchOverlay = () => {
    switch (this.state.step) {
      case 'generate':
        return (
          <Generate
            handleStepChange={this.handleStepChange}
            handleKeysChange={this.handleKeysChange}
          />
        );
      case 'download':
        return <Download keys={this.keys} />;
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      step: 'generate',
      isOpen: false,
      name: '',
      email: '',
      keys: {},
    };
  }

  render() {
    return (
      <>
        <NeutralButton
          onClick={() => {
            this.setState({ isOpen: true });
          }}
        >
          Start
        </NeutralButton>
        <Drawer
          isOpen={this.state.isOpen}
          placement="right"
          onClose={() => {
            this.setState({
              isOpen: false,
            });
          }}
          // finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          {this.switchOverlay()}
        </Drawer>
      </>
    );
  }
}

const Generate = ({ handleStepChange, handleKeysChange }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>Generate Keypair</DrawerHeader>

      <DrawerBody>
        <Input
          maxWidth="400px"
          mb="16px"
          placeholder="Name"
          onChange={e => setName(e.target.value)}
          value={name}
        />
        <Input
          maxWidth="400px"
          mb="16px"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
      </DrawerBody>
      <DrawerFooter>
        <NeutralButton
          onClick={async () => {
            handleKeysChange(await genKeys(name, email));
            handleStepChange('download');
          }}
        >
          Generate
        </NeutralButton>
      </DrawerFooter>
    </DrawerContent>
  );
};

const Download = ({ keys }) => {
  return (
    <>
      <pre>{keys}</pre>
    </>
  );
};

export default KeygenUI;
