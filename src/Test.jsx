import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLazyGetMessagesQuery } from './redux/apis/chatApi';

const Test = () => {
    const [getMessages, { isLoading, data, isSuccess }] = useLazyGetMessagesQuery()
    const [page, setPage] = useState(0)
    const [allMessages, setAllMessages] = useState([])
    useEffect(() => {
        getMessages({ id: "661a7f38d6a3b563cbc3d003", page })
    }, [page])

    useEffect(() => {
        if (isSuccess || data) {
            setAllMessages([...allMessages, ...data.result])
        }
    }, [isSuccess, data])
    return <>
        <h1>total {data && data.total}</h1>
        <h1> allMessages {allMessages.length}</h1>
        <div className='h-screen overflow-y-scroll bg-blue-200'>

            <InfiniteScroll
                height={400}
                style={{
                    height: 300,
                    overflow: 'auto',
                    // display: 'flex',
                    // flexDirection: 'column-reverse',
                }}
                dataLength={allMessages.length}
                hasMore={true}
                next={e => setPage(pre => pre + 1)}
            >
                {
                    allMessages.map(item => <div className='h-[40vh] m-4 bg-red-200 '>
                        {item.message}
                    </div>)
                }


            </InfiniteScroll>
        </div>
    </>

}

export default Test