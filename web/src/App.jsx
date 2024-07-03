import { useEffect, useState } from 'react'
import './App.css'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Center,
  Heading,
  Text,
  Button,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  UnorderedList,
  ListItem
} from '@chakra-ui/react'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'

function App() {
  const [ataques, setAtaques] = useState([])
  const [usuario, setUsuario] = useState({})
  const [page, setPage] = useState(0)
  const [maxPage, setMaxPage] = useState(0)
  const [asc, setAsc] = useState(null)
  const [ord, setOrd] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    let URL = `http://localhost:3000/ataques?page=${page}`
    if(asc != null && ord != null) {
      URL += `&order=${ord}&ascDesc=${asc}`
    }
    fetch(URL)
      .then(response => response.json())
      .then(json => {
        setMaxPage(400)
        setAtaques(json.resultado)
      })
  }, [page, asc])

  const orderBy = (order) => {
    console.log(order, asc)
    setOrd(order)
    if(asc == null) {
      setAsc('ASC')
    } else if (asc == 'DESC') {
      setAsc(null)
      setOrd(null)
    } else {
      setAsc('DESC')
    }
  }

  return (
    <Center flexDirection={'column'}>
      <Heading as='h1' size='xl' className='heading'>Aplicação SIEM</Heading>
      <Text fontSize='3xl' className='heading'>Tabela de ataques</Text>
      <div className='table-wrapper'>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th style={{cursor: 'pointer'}} onClick={() => orderBy('nome')}>Nome do usuário</Th>
                <Th style={{cursor: 'pointer'}} onClick={() => orderBy('pacoteTimestamp')}>Data e hora</Th>
                <Th>Severidade</Th>
                <Th>Tipo</Th>
                <Th>Ação</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ataques.map(ataque => (
                <>
                  <Tr key={ataque.idAtaque}>
                    <Td style={{cursor: 'pointer'}} onClick={() => {
                      fetch(`http://localhost:3000/usuarios/${ataque.idUsuario}`)
                      .then(response => response.json())
                      .then(json => {
                        setUsuario(json)
                      })
                      onOpen()
                    }}>{ataque.nome}</Td>
                    <Td>{new Date(ataque.pacoteTimestamp).toLocaleString()}</Td>
                    <Td>{ataque.severidade}</Td>
                    <Td>{ataque.tipo}</Td>
                    <Td>{ataque.acao}</Td>
                  </Tr>
                </>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
      <ButtonGroup spacing='6' className='button-wrapper'>
        <Button onClick={() => {
          if(page > 0){
            setPage(page - 1)
            console.log(page)
          }
        }}>
          <BsArrowLeft/>
        </Button>
        <Button onClick={() => {
          if(page <= maxPage){
            setPage(page + 1)
            console.log(page)
          }
        }}>
          <BsArrowRight/>
        </Button>
      </ButtonGroup>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{usuario.nome}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UnorderedList>
              <ListItem>Geolocalização: {usuario.geolocalizacao}</ListItem>
              <ListItem>User Agent: {usuario.userAgent}</ListItem>
              <ListItem>Segmento: {usuario.segmento}</ListItem>
              <ListItem>Total de pacotes: {usuario.Total_Pacotes}</ListItem>
            </UnorderedList>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  )
}

export default App
