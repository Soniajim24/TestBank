import Head from 'next/head';
import Image from 'next/image'
import Layout, { siteTitle } from '../components/layout';
import { BankForm } from '../components/context'; // Table
import { UserContext, UserProvider } from '../components/userContext';
import LoggedOutNavBar from '../components/LoggedOutNavbar';
import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../lib/initAuth';

import { User } from 'grommet-icons';

import {
    Title,
    Text,
    Anchor,
    rem,
    createStyles,
    Container,
    Group,
    Center,
    Card,
    Avatar,
    Table,
    ScrollArea,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
    full_container: {
        height: `calc(100vh - 60px)`,
        position: 'relative',
    },

    card_container: {
        marginTop: '2rem',

        [theme.fn.smallerThan('sm')]: {
            marginTop: '1rem'
        },
    },

    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        padding: '0em',
        width: '30em',

        [theme.fn.smallerThan('xs')]: {
            width: '19em',
        },
    },

    title: {
        fontWeight: 700,
        textTransform: "uppercase",
        fontFamily: `BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji ${theme.fontFamily}`,
        lineHeight: 1.1,

        [theme.fn.smallerThan('xs')]: {
            fontSize: '.9em',
        },
    },

    subtitle: {
        fontWeight: 700,
        textTransform: "none",
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        lineHeight: 1.1,

        [theme.fn.smallerThan('xs')]: {
            fontSize: '.95em',
        },
    },

    body: {
        padding: theme.spacing.md,
    },

    header: {
        position: 'sticky',
        top: 0,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease',

        '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
                }`,
        },
    },

    scrolled: {
        boxShadow: theme.shadows.sm,
    },

    table: {
        height: '23em',
        [theme.fn.smallerThan('xs')]: {
            height: '18em',
        },
    }

}));


function AllData() {
    //const { classes } = useStyles();

    const { classes, cx } = useStyles();
    const [scrolled, setScrolled] = useState(false);
    const [data, setData] = useState([]);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [balance, setBalance] = useState(0);
    const [password, setPassword] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const { userEmail } = useContext(UserContext);

    useEffect(() => {
        fetch('/api/users')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('User Email: ' + userEmail);
                if (userEmail) { // Only fetch data if userEmail is not empty
                    const response = await fetch(
                        `/api/get-user-by-email?email=${userEmail}`
                    );
                    if (response.ok) {
                        const user = await response.json();
                        setUserName(user.name);
                        setBalance(user.balance);
                        setPassword(user.password);
                        setAccountNumber(user.accountNumber)
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [userEmail]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                // User is signed in
                setUser(authUser);
            } else {
                // User is signed out
                setUser(null);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <Layout>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            {user ? (
                <>
                    <Center className={classes.card_container} mx="auto" maw="40em">
                        <Card withBorder shadow="sm" radius="md" px="1em" py="0" className={classes.card}>
                            <Group noWrap spacing={0}>
                                <Avatar size="4em" variant="filled" color="red.9" src="/images/user.png" radius="0" />
                                <div className={classes.body}>
                                    <Text className={classes.title} color="dimmed" mt="md" mb="md" size="lg">
                                        Name: <Text span className={classes.subtitle} color="black" fw={700}>{userName || 'Guest'}</Text>
                                    </Text>
                                    <Text className={classes.title} color="dimmed" mt="md" mb="md" size="lg">
                                        Email: <Text span className={classes.subtitle} color="black" fw={700}>{userEmail || 'guest@gmail.com'}</Text>
                                    </Text>
                                    <Text className={classes.title} color="dimmed" mt="md" mb="md" size="lg">
                                        Password: <Text span className={classes.subtitle} color="black" weight={700}>{password !== "" ? password : ''}</Text>
                                    </Text>
                                    <Text className={classes.title} color="dimmed" mt="md" mb="md" size="lg">
                                        Balance: <Text span className={classes.subtitle} color="black" weight={700}>${balance !== null ? balance : '-'}</Text>
                                    </Text>
                                    <Text className={classes.title} color="dimmed" mt="md" mb="md" size="lg">
                                        Account No: <Text span className={classes.subtitle} color="black" weight={700}>{accountNumber !== "" ? accountNumber : ''}</Text>
                                    </Text>
                                </div>
                            </Group>
                        </Card>
                    </Center>
                    <hr />
                    <Container radius={0} px={20} mb="1em" mih="8em">
                        <Title order={2} mt="md" mb={5}>
                            All Data
                        </Title>
                        <ScrollArea className={classes.table} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                            <Table highlightOnHover striped>
                                <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>$ {user.balance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </ScrollArea>
                    </Container>
                </>
            ) : (
                <Text fw={700} ta="center" mt="xl">
                    Please {' '}
                    <Anchor href="/createaccount" weight={700}>
                        register {' '}
                    </Anchor>
                    or {' '}
                    <Anchor href="/login" weight={700}>
                        login {' '}
                    </Anchor>
                    to get access to the content.
                </Text>
            )}
        </Layout>
    );
}

/* Set the Global User Context to AllData Component */
export default function AllDataWithContext() {
    return (
        <UserProvider>
            <LoggedOutNavBar />
            <AllData />
        </UserProvider>
    )
}