import { API } from 'aws-amplify';

export async function generateYaml(data) {
  const result = await API.post('api', '/generate-yaml', { body: data });
  return result.yaml;
}
