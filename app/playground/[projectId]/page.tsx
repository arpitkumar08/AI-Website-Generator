"use client"

import React, { useEffect, useState } from 'react'
import PlaygroundHeader from '../_components/PlaygroundHeader'
import ChatSection from '../_components/ChatSection'
import WebsiteDesign from '../_components/WebsiteDesign'
import ElementSettingSection from '../_components/ElementSettingSection'
import { useParams, useSearchParams } from 'next/navigation'
import axios from 'axios'

export type Frame = {
  projectId: string,
  frameId: string,
  designCode: string,
  chatMessages: Message[],
}

export type Message = {
  role: string,
  content: string,
}

const PlayGround = () => {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get('frameId')
  const [frameDetail, setFrameDetail] = useState<Frame>()

  useEffect(() => {
    frameId && GetFrameDetails()
  }, [frameId])

  const GetFrameDetails = async () => {
    const result = await axios.get('/api/frames?frameId=' + frameId + "&projectId=" + projectId)
    console.log(result.data);
    setFrameDetail(result.data)

  }

  const SendMessage = (userInput: string) => { }
  return (
    <div>
      <PlaygroundHeader />


      <div className='flex'>

        {/* ChatSection */}

        <ChatSection onSend={(input: string) => SendMessage(input)} messages={frameDetail?.chatMessages ?? []} />
        {/* WebsiteDesing */}

        <WebsiteDesign />

        {/* Setting section */}
        {/* <ElementSettingSection /> */}


      </div>


    </div>
  )
}

export default PlayGround